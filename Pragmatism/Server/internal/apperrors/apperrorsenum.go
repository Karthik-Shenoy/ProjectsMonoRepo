package apperrors

// Error Naming Convention {Service/Module}/{Error-Type}}/{Error-Name}
// Error Types
// Retryable: Errors that can be retried
// NonRetryable: Errors that cannot be retried

const (

	// SharedHelpers
	SharedHelpers_Retryable_RunCommandFailed = "SharedHelpers_Retryable_RunCommandFailed"

	// TaskHandler
	TaskHandler_Retryable_CreateFolderAndUpdateFilesFailed = "TaskHandler_Retryable_CreateFolderAndUpdateFilesFailed"

	// ContainerManagerService
	ContainerManagerService_Retryable_FailedToCopyFilesToContainer = "ContainerManagerService_Retryable_FailedToCopyFilesToContainer"
	ContainerManagerService_Retryable_FindContainerCommandFailed   = "ContainerManagerService_Retryable_FindContainerCommandFailed"
	ContainerManagerService_Retryable_ContainerFailedToStart       = "ContainerManagerService_Retryable_ContainerNotFound"
	ContainerManagerService_Retryable_FailedToKillContainer        = "ContainerManagerService_Retryable_FailedToKillContainer"
	ContainerManagerService_Retryable_FailedToRunTests             = "ContainerManagerService_Retryable_FailedToRunTests"
	ContainerManagerService_Retryable_FailedToCopyDebugLogs        = "ContainerManagerService_Retryable_FailedToCopyDebugLogs"
)
