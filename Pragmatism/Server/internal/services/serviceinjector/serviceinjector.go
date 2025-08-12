package serviceinjector

import (
	"fmt"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/services/telemetryservice"
	"reflect"
	"strings"
	"sync"
)

type FactoryFunction[T any] func(...any) (*T, error)
type FactoryFunctionLooselyTyped func(...any) (any, error)

type ServiceData[T any] struct {
	factory      FactoryFunction[T]
	dependencies []string
	instance     any
	serviceMutex *sync.Mutex
}

type GenericServiceData struct {
	factory      FactoryFunctionLooselyTyped
	dependencies []string
	instance     any
	serviceMutex *sync.Mutex
}

var globalServiceRegistryMutex sync.Mutex

var services = make(map[string]*GenericServiceData)

func (data *ServiceData[T]) copyToGenericServiceData() *GenericServiceData {
	return &GenericServiceData{
		factory:      getWrappedFactoryLooselyTyped(data.factory),
		dependencies: data.dependencies,
		instance:     data.instance,
		serviceMutex: data.serviceMutex,
	}
}

func StronglyTypedServiceDataFromGenericServiceData[T any](genericData *GenericServiceData) *ServiceData[T] {
	return &ServiceData[T]{
		factory:      getWrappedFactoryStronglyTyped[T](genericData.factory),
		dependencies: genericData.dependencies,
		instance:     genericData.instance,
		serviceMutex: genericData.serviceMutex,
	}
}

func getWrappedFactoryLooselyTyped[T any](specificFactory FactoryFunction[T]) FactoryFunctionLooselyTyped {
	return func(a ...any) (any, error) {
		resultPtr, err := specificFactory(a...)
		return resultPtr, err
	}
}

func getWrappedFactoryStronglyTyped[T any](genericFactory FactoryFunctionLooselyTyped) FactoryFunction[T] {
	return func(a ...any) (*T, error) {
		resultPtr, err := genericFactory(a...)

		castedPtr, ok := resultPtr.(*T)

		if !ok {
			panic(
				fmt.Sprintf(
					"can not cast from %s to %s",
					reflect.TypeOf(castedPtr).Elem().Name(),
					reflect.TypeOf((*T)(nil)).Elem().Name(),
				),
			)

		}

		return castedPtr, err
	}
}

func cacheServiceData[T any](serviceName string, serviceData *ServiceData[T]) {
	services[serviceName] = serviceData.copyToGenericServiceData()
}

func getCachedServiceData[T any](serviceName string) (*ServiceData[T], bool) {
	serviceData, ok := services[serviceName]

	if !ok {
		fmt.Printf("service %s was never registered", serviceName)
		return nil, false
	}

	return StronglyTypedServiceDataFromGenericServiceData[T](serviceData), true
}

func getCachedServiceDataGeneric(serviceName string) (*GenericServiceData, bool) {
	serviceData, ok := services[serviceName]

	if !ok {
		return nil, false
	}

	return serviceData, true
}

func getServiceName[T any]() string {
	return reflect.TypeOf((*T)(nil)).Elem().Name()
}

// ########################
// Public Static methods
// ########################

func RegisterService[T any](factory FactoryFunction[T]) {
	globalServiceRegistryMutex.Lock()
	defer globalServiceRegistryMutex.Unlock()

	serviceName := getServiceName[T]()
	if _, ok := services[serviceName]; ok {
		panic(fmt.Sprintf("%s was registered twice", serviceName))
	}

	serviceData := &ServiceData[T]{
		factory:      factory,
		dependencies: make([]string, 0),
		instance:     nil,
		serviceMutex: &sync.Mutex{},
	}

	// just add first level dependencies to the list
	serviceReflectType := reflect.TypeOf((*T)(nil)).Elem()
	for i := 0; i < serviceReflectType.NumField(); i++ {
		structFieldTypeName := serviceReflectType.Field(i).Type.Name()

		if structFieldTypeName == "" {
			structFieldTypeName = serviceReflectType.Field(i).Type.Elem().Name()
		}

		if strings.Contains(structFieldTypeName, "Service") {
			serviceData.dependencies = append(serviceData.dependencies, structFieldTypeName)
		}
	}

	cacheServiceData(serviceName, serviceData)
}

func GetService[T any]() (*T, *apperrors.AppError) {

	serviceName := getServiceName[T]()

	service, ok := getCachedServiceData[T](serviceName)

	if !ok {
		return nil, apperrors.NewAppError(
			apperrors.ServiceInjector_NonRetryable_FailedToGetService,
			"ServiceInjector.GetService",
			fmt.Sprintf("ServiceData is not present for  %s", serviceName),
		)
	}

	service.serviceMutex.Lock()
	defer service.serviceMutex.Unlock()

	if service.instance != nil {
		instance, ok := service.instance.(*T)
		if !ok {
			fmt.Printf("Type conversion failed for %s to %s", serviceName, reflect.TypeOf((*T)(nil)).Elem().Name())
			return nil, apperrors.NewAppError(
				apperrors.ServiceInjector_NonRetryable_FailedToGetService,
				"ServiceInjector.GetService",
				fmt.Sprintf("Type conversion failed for %s to %s", serviceName, reflect.TypeOf((*T)(nil)).Elem().Name()),
			)
		}
		return instance, nil
	}

	service.instance = dfsInstantiate(serviceName)

	instance, ok := service.instance.(*T)
	if !ok {
		fmt.Printf("Type conversion failed for %s to %s", serviceName, reflect.TypeOf((*T)(nil)).Elem().Name())
		return nil, apperrors.NewAppError(
			apperrors.ServiceInjector_NonRetryable_FailedToGetService,
			"ServiceInjector.GetService",
			fmt.Sprintf("DFS Instantiate Type conversion failed for %s to %s", serviceName, reflect.TypeOf((*T)(nil)).Elem().Name()),
		)
	}

	return instance, nil
}

// usually recursion is a bad idea in a coroutine based environment, due to stack overflow issues
// but the depth is really small, so we can go with it
func dfsInstantiate(rootServiceName string) any {

	service, ok := getCachedServiceDataGeneric(rootServiceName)

	if !ok {
		return nil
	}

	if service.instance != nil {
		return service.instance
	}

	serviceDependencyInstances := make([]any, 0)

	for _, dependency := range service.dependencies {
		serviceDependencyInstances = append(serviceDependencyInstances, dfsInstantiate(dependency))
	}

	var err error = nil
	service.instance, err = service.factory(serviceDependencyInstances...)

	if err != nil {
		telemetryservice.GetInstance().LogError(apperrors.NewAppError(
			apperrors.ServiceInjector_NonRetryable_FailedToInstantiateService,
			"ServiceInjector.dfsInstantiate",
			fmt.Sprintf("Failed to instantiate service %s: %s", rootServiceName, err.Error()),
		))
		return nil
	}

	return service.instance
}
