package tasks_model

import (
	"encoding/json"
	"fmt"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/services/db_cache_service"
	"pragmatism/internal/services/serviceinjector"
)

func getServiceErrorOrigin(funcName string) string {
	return "TasksModelService." + funcName
}

type Task struct {
	Id          uint32 `json:"id"`          // Unique identifier for the problem
	Title       string `json:"title"`       // Title of the problem
	Description string `json:"description"` // Description of the problem
	NumSolves   uint32 `json:"numSolves"`   // Number of solves for the problem
	MarkdownUrl string `json:"markdownUrl"` // URL to the markdown file for the problem
	TaskDir     string `json:"taskDir"`     // Folder for the container
	Language    string `json:"language"`    // Programming language for the task
}

type TaskFile struct {
	TaskId   uint32 `json:"taskId"`   // Unique identifier for the task
	FileName string `json:"fileName"` // Name of the file
	FileType int    `json:"fileType"` // Type of the file
}

type TasksModelService struct {
	dbCacheInstance *db_cache_service.DBCacheService
}

func (mdl TasksModelService) GetTasks() ([]Task, *apperrors.AppError) {

	problems := make([]Task, 0)

	payload, appErr := mdl.dbCacheInstance.Query("SELECT id, title, description, num_solves, markdown_url, task_dir, language FROM tasks", false /* shouldForceFetch */)

	if appErr != nil {
		return problems, apperrors.NewAppError(
			apperrors.TasksModel_Retryable_FailedToGetTasks,
			getServiceErrorOrigin("GetTasks"),
			"Failed to get tasks : "+appErr.Message,
		)
	}

	err := json.Unmarshal(payload, &problems)

	if err != nil {
		return problems, apperrors.NewAppError(
			apperrors.TasksModel_Retryable_FailedToUnmarshalTasks,
			getServiceErrorOrigin("GetTasks"),
			"Failed to unmarshal tasks : "+err.Error(),
		)
	}

	return problems, nil
}

func (mdl TasksModelService) GetTaskFilesForTask(taskId uint32) ([]TaskFile, *apperrors.AppError) {

	payload, appErr := mdl.dbCacheInstance.Query(fmt.Sprintf("SELECT * FROM task_files WHERE task_id = %d", taskId), false /* shouldForceFetch */)

	if appErr != nil {
		return nil, apperrors.NewAppError(
			apperrors.TasksModel_Retryable_FailedToGetTaskFiles,
			getServiceErrorOrigin("GetTaskFilesForTask"),
			"Failed to get task files : "+appErr.Message,
		)
	}

	taskFiles := make([]TaskFile, 0)
	err := json.Unmarshal(payload, &taskFiles)

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.TasksModel_Retryable_FailedToUnmarshalTaskFiles,
			getServiceErrorOrigin("GetTaskFilesForTask"),
			"Failed to unmarshal task files : "+err.Error(),
		)
	}

	return taskFiles, nil
}

func init() {
	var factory serviceinjector.FactoryFunction[TasksModelService] = func(args ...any) (*TasksModelService, error) {
		dbCacheService, ok := args[0].(*db_cache_service.DBCacheService)
		if !ok || dbCacheService == nil {
			return nil, fmt.Errorf("TasksModelService.factory: invalid argument type or nil value")
		}
		return &TasksModelService{
			dbCacheInstance: dbCacheService,
		}, nil
	}

	serviceinjector.RegisterService(factory)
}
