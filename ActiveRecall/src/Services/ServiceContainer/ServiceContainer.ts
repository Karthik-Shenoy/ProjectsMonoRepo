import {
    dependencyLookupMap,
    ServiceData,
    ServiceDependencyMap,
    ServiceFactory,
} from "./ServiceDefinitions";

export class ServiceContainer {
    private servicesMap: Map<keyof ServiceDependencyMap, ServiceData<keyof ServiceDependencyMap>>;

    // Singleton instance
    private static _instance: ServiceContainer | null;

    private constructor() {
        this.servicesMap = new Map<
            keyof ServiceDependencyMap,
            ServiceData<keyof ServiceDependencyMap>
        >();
    }

    public static get instance(): ServiceContainer {
        if (!ServiceContainer._instance) {
            ServiceContainer._instance = new ServiceContainer();
        }
        return ServiceContainer._instance;
    }

    public get<T extends keyof ServiceDependencyMap>(
        serviceName: T
    ): ServiceDependencyMap[T]["type"] {
        const serviceData = this.servicesMap.get(serviceName);

        if (!serviceData) {
            throw Error(`ServiceContainer.get: There is no registered factory for ${serviceName}`);
        }

        if (serviceData.instance) {
            return serviceData.instance;
        }

        let dependenciesArray: unknown[] = [];
        for (const dependency of serviceData?.dependencyKeys) {
            const serviceDependencyInstance = this.get(dependency);
            dependenciesArray.push(serviceDependencyInstance);
        }

        serviceData.instance = serviceData.serviceFactory(
            ...(dependenciesArray as ServiceDependencyMap[T]["dependencies"])
        );

        return serviceData.instance;
    }

    public register<T extends keyof ServiceDependencyMap>(
        serviceName: T,
        serviceFactory: ServiceFactory<T>
    ) {
        if (this.servicesMap.has(serviceName)) {
            this.disposeInternal();
            throw Error(
                `ServiceContainer.register: The service factory was already registered for ${serviceName}`
            );
        }

        this.servicesMap.set(serviceName, {
            serviceFactory,
            instance: null,
            dependencyKeys: dependencyLookupMap[serviceName],
            serviceName,
        });
    }

    public static dispose() {
        this._instance?.disposeInternal();
        this._instance = null;
    }

    private disposeInternal() {
        this.servicesMap.clear();
    }
}
