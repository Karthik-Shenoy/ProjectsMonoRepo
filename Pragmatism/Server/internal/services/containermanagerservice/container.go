package containermanagerservice

import (
	"fmt"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/helpers"
	contracts "pragmatism/internal/services/containermanagerservice/contracts"
	"pragmatism/internal/shared_types"
	"strings"
	"time"
)

type Container struct {
	pTasksQueue   *shared_types.Queue[*contracts.TaskNotifierWrapper]
	isRunningTask bool
	// task-container-*
	ContainerName string
	TaskDir       string
}

// Runs the container and starts the task loop
func (container *Container) Start() *apperrors.AppError {
	appErr := RunContainer(container.TaskDir, container.ContainerName)
	fmt.Println("container.Start()")
	if appErr != nil {
		fmt.Println(appErr.Err())
		return appErr
	}

	go func() {
		for {
			fmt.Println("Task loop running")
			fmt.Println("Trace: task queue", container.pTasksQueue, "IsEmpty", container.pTasksQueue.IsEmpty())
			if container.pTasksQueue.IsEmpty() {
				time.Sleep(500 * time.Millisecond)
				continue
			}

			task, err := container.pTasksQueue.Dequeue()
			if err != nil {
				// impossible case log and continue
				fmt.Println("Impossible Case!:", err)
				continue
			}

			// check if container is running
			fIsContainerRunningForTask, appErr := IsContainerRunningForTask(container.ContainerName)
			if appErr != nil {
				// strange case log and handle error and continue
				task.ChanNotifier <- &contracts.TaskNotification{
					Result: nil,
					Err:    appErr,
				}
				continue
			}

			if !fIsContainerRunningForTask {
				// attempt creating/running new container
				container.pTasksQueue.Enqueue(task)
				continue
			}

			fmt.Println("Trace: Copied files to container")
			// copy files from the task into container run them and notify the enqueuer
			userFilesDirForTask := getUserFilesTempDirNameForTask(task.PTask.UserName, task.PTask.TaskDir)
			appErr = copyFilesToContainer(userFilesDirForTask, container.ContainerName, TASK_DEST_PATH)
			if appErr != nil {
				task.ChanNotifier <- &contracts.TaskNotification{
					Result: nil,
					Err:    appErr,
				}
				fmt.Println(appErr.Err())
				continue
			}

			fmt.Println("Trace: Running tests")
			// run tests
			result := helpers.RunCmdAndGetStdFiles("docker", "exec", container.ContainerName, "npm", "run", "test")
			if result.Err != nil {
				stdErrMsg := ""

				if result.StdErr != nil {
					if strings.Contains(*result.StdErr, TASK_TEST_IDENTIFIER_PREFIX) {
						dbgLogs, appErr := ReadDebugLogsFromContainer(container.ContainerName)

						if appErr != nil {
							task.ChanNotifier <- &contracts.TaskNotification{
								Result: nil,
								Err:    appErr,
							}
							continue
						}

						task.ChanNotifier <- &contracts.TaskNotification{
							Result:  result.StdErr,
							DbgLogs: dbgLogs,
							Err:     nil,
						}
						continue
					}
					stdErrMsg = *result.StdErr
				}

				task.ChanNotifier <- &contracts.TaskNotification{
					Result: nil,
					Err: apperrors.NewAppError(
						apperrors.ContainerManagerService_Retryable_FailedToRunTests,
						getServiceErrorOrigin("Start"),
						"Failed to run tests err:"+result.Err.Error()+", stdErr:"+stdErrMsg,
					),
				}
				continue
			}

			dbgLogs, appErr := ReadDebugLogsFromContainer(container.ContainerName)

			if appErr != nil {
				task.ChanNotifier <- &contracts.TaskNotification{
					Result: nil,
					Err:    appErr,
				}
				continue
			}

			task.ChanNotifier <- &contracts.TaskNotification{
				Result:  result.StdOut,
				DbgLogs: dbgLogs,
				Err:     nil,
			}
		}
	}()

	return nil
}

func (container *Container) IsContainerFree() bool {
	return !container.isRunningTask && container.pTasksQueue.IsEmpty()
}

func (container *Container) CNumQueuedTasks() uint16 {
	return container.pTasksQueue.CSize()
}

func (container *Container) Enqueue(item *contracts.TaskNotifierWrapper) {
	fmt.Println("Trace: task enqueued at container")
	container.pTasksQueue.Enqueue(item)
}

func (container *Container) Kill() *apperrors.AppError {
	result := helpers.RunCmdAndGetStdFiles("docker", "stop", container.ContainerName)

	if result.Err != nil {
		errMsg := ""
		if result.StdErr != nil {
			errMsg = *result.StdErr
		}
		return apperrors.NewAppError(
			apperrors.ContainerManagerService_Retryable_FailedToKillContainer,
			getServiceErrorOrigin("Kill"),
			"stdErr: "+errMsg,
		)
	}
	return nil
}

func NewContainer(taskDir string, suffixCnt uint64) *Container {
	return &Container{
		pTasksQueue:   shared_types.NewQueue[*contracts.TaskNotifierWrapper](),
		ContainerName: GetContainerNameForTask(taskDir + fmt.Sprintf("%d", suffixCnt)),
		TaskDir:       taskDir,
		isRunningTask: false,
	}
}
