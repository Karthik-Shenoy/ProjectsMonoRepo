package users_model

import (
	"encoding/json"
	"fmt"
	"pragmatism/api"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/services/database_service"
	"pragmatism/internal/services/db_cache_service"
	"pragmatism/internal/services/serviceinjector"
	"time"
)

type User struct {
	Id         string `json:"id"`
	Email      string `json:"email"`
	Name       string `json:"name"`
	PictureUri string `json:"picture"`
}

func getServiceErrorOrigin(funcName string) string {
	return "UsersModelService." + funcName
}

type UsersModelService struct {
	dbCacheInstance *db_cache_service.DBCacheService
	dbInstance      *database_service.DatabaseService
}

func NewUserModel(dbCacheInstance *db_cache_service.DBCacheService, dbInstance *database_service.DatabaseService) *UsersModelService {
	return &UsersModelService{
		dbCacheInstance: dbCacheInstance,
		dbInstance:      dbInstance,
	}
}

func (mdl *UsersModelService) DoesUserExist(userId string) (bool, *apperrors.AppError) {

	queryResponsePayload, err := mdl.dbCacheInstance.Query(fmt.Sprintf("Select * from users where id = '%s'", userId), true /* shouldForceFetch */)

	if err != nil {

	}

	var userIds []User
	json.Unmarshal(queryResponsePayload, &userIds)

	if len(userIds) < 1 {
		return false, nil
	}

	return userIds[0].Id == userId, nil
}

func (mdl *UsersModelService) GetUser(userId string) (*User, *apperrors.AppError) {
	queryResponsePayload, err := mdl.dbCacheInstance.Query(fmt.Sprintf("Select * from users where id = '%s'", userId), true /* shouldForceFetch */)

	if err != nil {
		return nil, apperrors.NewAppErrorFromLowerLayerError(
			apperrors.UsersModelService_Retryable_FailedToGetUser,
			getServiceErrorOrigin("GetUser"),
			err.Message,
			err,
		)
	}

	var users []User
	json.Unmarshal(queryResponsePayload, &users)

	if len(users) < 1 {
		return nil, apperrors.NewAppError(
			apperrors.UsersModelService_NonRetryable_UserNotFound,
			getServiceErrorOrigin("GetUser"),
			"User not found",
		)
	}

	return &users[0], nil
}

func (mdl *UsersModelService) GetSolvedTasks(userId string) ([]api.SolvedTask, *apperrors.AppError) {
	query := `
	SELECT
    	u.id AS UserID,
    	u.name,
    	t.id AS TaskID,
    	t.title, 
    	st.solution,
		st.solved_at
	FROM
    	users u
	JOIN
    	solved_tasks st ON u.id = st.userId
	JOIN
    	tasks t ON st.taskId = t.id;
	`
	queryResponsePayload, err := mdl.dbCacheInstance.Query(query, true /* shouldForceFetch */)
	if err != nil {
		return nil, apperrors.NewAppErrorFromLowerLayerError(
			apperrors.UsersModelService_Retryable_FailedToGetSolvedTasks,
			getServiceErrorOrigin("GetSolvedTasks"),
			err.Message,
			err,
		)
	}

	var solvedTasks []api.SolvedTask
	json.Unmarshal(queryResponsePayload, &solvedTasks)

	return solvedTasks, nil
}

func (mdl *UsersModelService) UpdateSolvedTask(userId string, taskId string, solution string) *apperrors.AppError {
	solvedAt := time.Now()
	formattedSolvedAt := solvedAt.Format("2006-01-02")
	query := fmt.Sprintf(
		`
		INSERT INTO solved_tasks (userid, taskid, solved_at, solution) 
		VALUES ('%s', '%s', '%s', '%s') 
		ON CONFLICT (userid, taskid) DO NOTHING
		`,
		userId, taskId, formattedSolvedAt, solution)

	if _, err := mdl.dbInstance.Query(query); err != nil {
		return apperrors.NewAppErrorFromLowerLayerError(
			apperrors.UsersModelService_Retryable_FailedToUpdateSolvedTask,
			getServiceErrorOrigin("UpdateSolvedTask"),
			err.Message,
			err,
		)
	}

	return nil
}

func (mdl *UsersModelService) CreateUser(user *User) *apperrors.AppError {
	query := fmt.Sprintf("INSERT INTO users (id, email, name, picture, solves) VALUES ('%s', '%s', '%s', '%s', 0)",
		user.Id, user.Email, user.Name, user.PictureUri)

	if _, err := mdl.dbInstance.Query(query); err != nil {
		return apperrors.NewAppErrorFromLowerLayerError(
			apperrors.UsersModelService_Retryable_FailedToCreateUser,
			getServiceErrorOrigin("CreateUser"),
			err.Message,
			err,
		)
	}

	return nil
}

func init() {
	factory := func(args ...any) (*UsersModelService, error) {

		if len(args) != 2 {
			return nil, fmt.Errorf("UsersModelService.factory: invalid number of arguments")
		}

		dbCacheService, ok := args[0].(*db_cache_service.DBCacheService)
		if !ok || dbCacheService == nil {
			return nil, fmt.Errorf("UsersModelService.factory: invalid argument type or nil value, dbCacheService")
		}
		dbService, ok := args[1].(*database_service.DatabaseService)
		if !ok || dbService == nil {
			return nil, fmt.Errorf("UsersModelService.factory: invalid argument type or nil value, dbService")
		}
		return &UsersModelService{
			dbCacheInstance: dbCacheService,
			dbInstance:      dbService,
		}, nil
	}
	serviceinjector.RegisterService(factory)
}
