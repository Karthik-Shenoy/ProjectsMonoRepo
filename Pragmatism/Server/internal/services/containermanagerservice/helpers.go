package containermanagerservice

import (
	"fmt"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/helpers"
	"strings"
)

// [local helper] returns service error origin string for container manager service
func getServiceErrorOrigin(funcName string) string {
	return "ContainerManagerService." + funcName
}

func copyFilesToContainer(srcPath string, containerName string, destPath string) *apperrors.AppError {
	result := helpers.RunCmdAndGetStdFiles("docker", "cp", srcPath, containerName+":"+destPath)

	if result.Err != nil {
		errMsg := ""
		if result.StdErr != nil {
			errMsg = *result.StdErr
		}
		return apperrors.NewAppError(
			apperrors.ContainerManagerService_Retryable_FailedToCopyFilesToContainer,
			getServiceErrorOrigin("CopyFilesToContainer"),
			"stdErr: "+errMsg,
		)
	}
	return nil
}

func IsContainerRunningForTask(containerName string) (bool, *apperrors.AppError) {
	runCmdResult := helpers.RunCmdAndGetStdFiles("docker", "inspect", "-f", "\"{{.State.Running}}\"", containerName)

	if runCmdResult.Err != nil {
		if runCmdResult.StdErr != nil &&
			strings.Contains(
				*(runCmdResult.StdErr),
				fmt.Sprintf("No such object: %s", containerName)) {
			return false, nil
		}

		return false, apperrors.NewAppError(
			apperrors.ContainerManagerService_Retryable_FindContainerCommandFailed,
			getServiceErrorOrigin("IsContainerRunningForTask"),
			fmt.Sprint(
				"Run Command  failed for docker inspect command: ",
				", RunCmdResult.StdErr: ", runCmdResult.StdErr),
		)

	}

	return true, nil
}

func RunContainer(taskDir, containerName string) *apperrors.AppError {
	imageName := GetImageNameForTask(taskDir)
	runCmdResult := helpers.RunCmdAndGetStdFiles("docker", "run", "-d", "--name", containerName, imageName)

	if runCmdResult.Err != nil {
		errorInfo := ""
		if runCmdResult.StdErr != nil {
			errorInfo = fmt.Sprintf(", RunCmdResult.StdErr: %s", *(runCmdResult.StdErr))
		} else {
			errorInfo = ", RunCmdResult.Err: " + runCmdResult.Err.Error()
		}
		return apperrors.NewAppError(
			apperrors.ContainerManagerService_Retryable_ContainerFailedToStart,
			getServiceErrorOrigin("RunContainer"),
			fmt.Sprint(
				"Run Command  failed for docker run command: ",
				", errorInfo:", errorInfo,
				"err:", runCmdResult.Err.Error()),
		)
	}

	return nil
}

func ReadDebugLogsFromContainer(containerName string) (*string, *apperrors.AppError) {
	cmdResult := helpers.RunCmdAndGetStdFiles("docker", "exec", containerName, "cat", LOG_PATH)

	if cmdResult.Err != nil {
		errMsg := ""
		if cmdResult.StdErr != nil {
			errMsg = *cmdResult.StdErr
		}
		return nil, apperrors.NewAppError(
			apperrors.ContainerManagerService_Retryable_FailedToCopyDebugLogs,
			getServiceErrorOrigin("ReadDebugLogsFromContainer"),
			"stdErr: "+errMsg,
		)
	}

	return cmdResult.StdOut, nil
}

func GetContainerNameForTask(taskDir string) string {
	return CONTAINER_NAME_PREFIX + taskDir
}

func GetImageNameForTask(taskDir string) string {
	return IMAGE_NAME_PREFIX + taskDir
}

func getUserFilesTempDirNameForTask(userName string, taskDir string) string {
	return fmt.Sprintf("%s/%s-%s/.", USER_FILES_TEMP_DIR, userName, taskDir)
}
