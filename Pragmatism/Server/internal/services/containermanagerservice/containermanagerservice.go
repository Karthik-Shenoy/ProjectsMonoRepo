package containermanagerservice

import (
	"fmt"
	"pragmatism/internal/apperrors"
	contracts "pragmatism/internal/services/containermanagerservice/contracts"
	"pragmatism/internal/shared_types"
	"sync"
	"time"
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
//   - spawn a new container when
//   - existing containers are busy and we have space for a new container
//   - container is un-available
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

var instance *ContainerManagerService
var singletonMutex sync.Mutex

func GetInstance() *ContainerManagerService {
	singletonMutex.Lock()
	defer singletonMutex.Unlock()

	if instance == nil {
		instance = &ContainerManagerService{
			counter:    0,
			pTaskQueue: shared_types.NewQueue[*contracts.TaskNotifierWrapper](),
			containers: make([](*Container), 0),
		}
		instance.Start()
	}

	return instance
}
