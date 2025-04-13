package apperrors

// Error Naming Convention {Service/Module}_{Error-Type}}_{Error-Name}
// Error Types
// Retryable: Errors that can be retried
// NonRetryable: Errors that cannot be retried

const (
	// GenericError
	GenericError_Retryable_GenericError = "GenericError_Retryable_GenericError"

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

	// DBCacheService
	DBCacheService_Retryable_FailedToQueryDatabase       = "DBCacheService_Retryable_FailedToQueryDatabase"
	DBCacheService_Retryable_FailedToGetCleanedColumns   = "DBCacheService_Retryable_FailedToGetCleanedColumns"
	DBCacheService_Retryable_FailedToGetColumnTypes      = "DBCacheService_Retryable_FailedToGetColumnTypes"
	DBCacheService_Retryable_FailedToScanRows            = "DBCacheService_Retryable_FailedToScanRows"
	DBCacheService_NonRetryable_FailedToMarshalCacheData = "DBCacheService_NonRetryable_FailedToMarshalCacheData"

	// DataBaseService
	DataBaseService_Retryable_FailedToQueryDatabase = "DBService_Retryable_FailedToQueryDatabase"

	// AuthHelpers
	AuthHelpers_NonRetryable_FailedToAuthenticateUser                   = "AuthHelpers_NonRetryable_FailedToAuthenticateUser"
	AuthHelpers_NonRetryable_FailedToBuildAccessTokenRequest            = "AuthHelpers_NonRetryable_FailedToBuildAccessTokenRequest"
	AuthHelpers_NonRetryable_FailedToParseAccessTokenResponse           = "AuthHelpers_NonRetryable_FailedToParseAccessTokenResponse"
	AuthHelpers_NonRetryable_FailedToGetAccessToken                     = "AuthHelpers_NonRetryable_FailedToGetAccessToken"
	AuthHelpers_NonRetryable_FailedToBuildUserInfoRequest               = "AuthHelpers_NonRetryable_FailedToBuildUserInfoRequest"
	AuthHelpers_NonRetryable_FailedToGetUserInfo                        = "AuthHelpers_NonRetryable_FailedToGetUserInfo"
	AuthHelpers_NonRetryable_FailedToCreateNewUser                      = "AuthHelpers_NonRetryable_FailedToCreateNewUser"
	AuthHelpers_NonRetryable_FailedToParseUserInfoResponse              = "AuthHelpers_NonRetryable_FailedToParseUserInfoResponse"
	AuthHelpers_NonRetryable_FailedToParseAuthenticationToken           = "AuthHelpers_NonRetryable_FailedToParseAuthenticationToken"
	AuthHelpers_NonRetryable_FailedToDecodeAuthenticationTokenPayload   = "AuthHelpers_NonRetryable_FailedToDecodeAuthenticationTokenPayload"
	AuthHelpers_NonRetryable_FailedToDecodeAuthenticationTokenSignature = "AuthHelpers_NonRetryable_FailedToDecodeAuthenticationTokenSignature"
	AuthHandlers_NonRetryable_FailedToMarshallAuthToken                 = "AuthHandlers_NonRetryable_FailedToMarshallAuthToken"
	AuthHandlers_NonRetryable_FailedToDecodeHexTokenValue               = "AuthHandlers_NonRetryable_FailedToDecodeHexTokenValue"

	// UserModel
	UsersModelService_Retryable_FailedToGetUser          = "UsersModelService_Retryable_FailedToGetUser"
	UsersModelService_Retryable_FailedToCreateUser       = "UsersModelService_Retryable_FailedToCreateUser"
	UsersModelService_NonRetryable_UserNotFound          = "UsersModelService_NonRetryable_UserNotFound"
	UsersModelService_Retryable_FailedToUpdateSolvedTask = "UsersModelService_Retryable_FailedToUpdateSolvedTask"

	// TaskModel
	TasksModel_Retryable_FailedToGetTasks           = "TasksModel_Retryable_FailedToGetTask"
	TasksModel_Retryable_FailedToGetTaskFiles       = "TasksModel_Retryable_FailedToGetTaskFiles"
	TasksModel_Retryable_FailedToUnmarshalTasks     = "TasksModel_NonRetryable_FailedToUnmarshalTasks"
	TasksModel_Retryable_FailedToUnmarshalTaskFiles = "TasksModel_NonRetryable_FailedToUnmarshalTaskFiles"

	// ServiceInjector
	ServiceInjector_NonRetryable_FailedToInstantiateService = "ServiceInjector_NonRetryable_FailedToInstantiateService"
	ServiceInjector_NonRetryable_FailedToGetService         = "ServiceInjector_NonRetryable_FailedToGetService"

	// AppErrors
	AppError_NonRetryable_FailedToMarshallResponse = "AppError_NonRetryable_FailedToMarshallResponse"

	// TaskHandlers
	TaskHandlers_Retryable_FailedToReadFile = "TaskHandlers_Retryable_FailedToReadFile"

	// AuthHandlers
	AuthHandlers_NonRetryable_FailedToGetUserIdFromTokenPayload       = "OauthHandlers_NonRetryable_FailedToGetUserIdFromTokenPayload"
	AuthHandlers_NonRetryable_FailedToGetUserDataCorrespondingToTheId = "OauthHandlers_NonRetryable_FailedToGetUserIdFromTokenPayload"
	AuthHandlers_NonRetryable_FailedToMarshallUserData                = "AuthHandlers_NonRetryable_FailedToMarshallUserData"

	// UserDataHandlers
	UserDataHandlers_NonRetryable_FailedToGetSolvedProblems      = "UserDataHandlers_NonRetryable_FailedToGetSolvedProblems"
	UserDataHandlers_NonRetryable_FailedToMarshallSolvedProblems = "UserDataHandlers_NonRetryable_FailedToMarshallSolvedProblems"
	UsersModelService_Retryable_FailedToGetSolvedTasks           = "UsersModelService_Retryable_FailedToGetSolvedTasks"
)
