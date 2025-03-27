package container_manager_contracts

import (
	"pragmatism/api"
	"pragmatism/internal/apperrors"
)

type TaskNotification struct {
	Result  *string
	DbgLogs *string
	Err     *apperrors.AppError
}

type TaskNotifierWrapper struct {
	PTask        *api.TaskSubmitRequest
	ChanNotifier chan *TaskNotification
	// add retry counts
}

func WrapTaskWithNotifier(pTask *api.TaskSubmitRequest, pNotifierChan chan *TaskNotification) *TaskNotifierWrapper {
	return &TaskNotifierWrapper{
		pTask,
		pNotifierChan,
	}
}
