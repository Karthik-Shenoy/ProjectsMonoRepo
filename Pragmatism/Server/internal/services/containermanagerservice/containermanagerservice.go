package containermanagerservice

import (
	"fmt"
	"pragmatism/internal/apperrors"
	contracts "pragmatism/internal/services/containermanagerservice/contracts"
	"pragmatism/internal/shared_types"
	"sync"
	"time"

	"pragmatism/internal/services/serviceinjector"
)

type TaskQueue = shared_types.Queue[*contracts.TaskNotifierWrapper]

type ContainerManagerService struct {
	pTaskQueue *TaskQueue
	containers [](*Container)
	counter    uint64
	queueMutex sync.Mutex
}

// starts the task loop and distributes the tasks
//   - if a container is available queue the task
//   - else spawn a new container when
//   - if existing containers are busy and we have space for a new container spawn a new one
//   - if container is un-available spawn a new one
//   - if all containers are busy kill the least recently used container and spawn a new one
func (containerMgrService *ContainerManagerService) Start() {
	go func() {
		for {
			containerMgrService.queueMutex.Lock()
			if containerMgrService.pTaskQueue.IsEmpty() {
				containerMgrService.queueMutex.Unlock()
				continue
			}

			task, err := containerMgrService.pTaskQueue.Dequeue()

			if err != nil {
				// strange error: log it
				containerMgrService.queueMutex.Unlock()
				continue
			}

			if len(containerMgrService.containers) < MAX_CONCURRENT_CONTAINERS {
				newContainer, appErr := containerMgrService.createAndStartNewContainerForTask(task)
				if appErr != nil {
					task.ChanNotifier <- &contracts.TaskNotification{
						Result: nil,
						Err:    appErr,
					}
					containerMgrService.queueMutex.Unlock()
					continue
				}
				newContainer.Enqueue(task)
				containerMgrService.queueMutex.Unlock()
				continue
			}

			var optimalContainer *Container = nil
			var minTasks uint16 = (1<<16 - 1)
			for _, container := range containerMgrService.containers {
				if container.TaskDir == task.PTask.TaskDir && container.CNumQueuedTasks() < minTasks {
					minTasks = container.CNumQueuedTasks()
					optimalContainer = container
				}
			}

			// no container exists
			if optimalContainer == nil {
				appErr := containerMgrService.killLRUContainer()
				if appErr != nil {
					task.ChanNotifier <- &contracts.TaskNotification{
						Result: nil,
						Err:    appErr,
					}
					containerMgrService.queueMutex.Unlock()
					continue
				}
				optimalContainer, appErr = containerMgrService.createAndStartNewContainerForTask(task)

				if appErr != nil {
					containerMgrService.queueMutex.Unlock()
					continue
				}
			}

			optimalContainer.Enqueue(task)
			containerMgrService.queueMutex.Unlock()
		}

	}()

	// prune free containers every 10 seconds
	go func() {
		for {
			time.Sleep(10 * time.Second)
			containerMgrService.queueMutex.Lock()
			appErr := containerMgrService.pruneFreeContainers()
			if appErr != nil {
				// log error
				fmt.Println("Error while killing free containers:", appErr.Err())
			}
			containerMgrService.queueMutex.Unlock()
		}
	}()
}

func (containerMgrService *ContainerManagerService) QueueTask(taskItem *contracts.TaskNotifierWrapper) {
	containerMgrService.queueMutex.Lock()
	defer containerMgrService.queueMutex.Unlock()

	containerMgrService.pTaskQueue.Enqueue(taskItem)
}

// kill least recently used container
func (containerMgrService *ContainerManagerService) killLRUContainer() *apperrors.AppError {
	for {
		for _, container := range containerMgrService.containers {
			if container.IsContainerFree() {
				appErr := container.Kill()
				if appErr != nil {
					return appErr
				}
				return nil
			}
		}
		time.Sleep(SLEEP_TIME_MS)
	}
}

func (containerMgrService *ContainerManagerService) pruneFreeContainers() *apperrors.AppError {
	for _, container := range containerMgrService.containers {
		if container.IsContainerFree() {
			appErr := container.Kill()
			if appErr != nil {
				return appErr
			}
		}
	}
	return nil
}

func (containerMgrService *ContainerManagerService) createAndStartNewContainerForTask(task *contracts.TaskNotifierWrapper) (*Container, *apperrors.AppError) {
	fmt.Println("Trace: Creating a new container")

	newContainer := NewContainer(task.PTask.TaskDir, containerMgrService.counter)
	containerMgrService.containers = append(containerMgrService.containers, newContainer)
	containerMgrService.counter++
	if appErr := newContainer.Start(); appErr != nil {
		return nil, appErr
	}
	return newContainer, nil
}

func init() {
	// register the service in the service injector
	var factory serviceinjector.FactoryFunction[ContainerManagerService] = func(args ...any) (*ContainerManagerService, error) {
		instance := &ContainerManagerService{
			counter:    0,
			pTaskQueue: shared_types.NewQueue[*contracts.TaskNotifierWrapper](),
			containers: make([](*Container), 0),
		}
		instance.Start()
		return instance, nil
	}

	serviceinjector.RegisterService(factory)
}
