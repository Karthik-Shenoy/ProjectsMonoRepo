package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"pragmatism/api"

	"pragmatism/internal/apperrors"
	"pragmatism/internal/helpers"
	"pragmatism/internal/middlewares"
	"pragmatism/internal/services/containermanagerservice"
	container_manager_contracts "pragmatism/internal/services/containermanagerservice/contracts"
	"pragmatism/internal/services/serviceinjector"

	tasks_model "pragmatism/internal/models/tasksmodel"
	users_model "pragmatism/internal/models/usersmodel"

	"strconv"
	"strings"
)

func getServiceErrorOrigin(funcName string) string {
	return "task_handler." + funcName
}

func InitTaskHandlers() {
	http.HandleFunc("GET /tasks", middlewares.CorsMiddleware(handleGetTasks, http.MethodGet))
	http.HandleFunc("GET /tasks/", middlewares.CorsMiddleware(handleGetTask, http.MethodGet))
	http.HandleFunc("POST /tasks/", middlewares.CorsMiddleware(handleSubmitTask, http.MethodPost))
}

func handleGetTasks(w http.ResponseWriter, req *http.Request) {
	pathTokens := getPathTokens(req)

	// Check if the path is valid and let other handlers handle it
	if len(pathTokens) > 1 || pathTokens[0] != "tasks" {
		return
	}

	tasksModelService, appErr := serviceinjector.GetService[tasks_model.TasksModelService]()

	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(
			apperrors.NewAppErrorFromLowerLayerError(
				apperrors.GenericError_Retryable_GenericError,
				getServiceErrorOrigin("handleGetTasks"),
				"Failed to create task model service",
				appErr,
			),
		)
		w.Write(payload)
		return
	}

	tasks, appErr := tasksModelService.GetTasks()

	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write([]byte(payload))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	payload, err := json.Marshal(tasks)

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	w.Write(payload)
}

func handleGetTask(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Path
	pathTokens := strings.Split(path[1:], "/")
	if len(pathTokens) < 2 || pathTokens[0] != "tasks" {
		fmt.Println("TaskHandlers.handleGetTask: Invalid path, with tokens:", pathTokens)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad Request"))
		return
	}

	taskId, err := strconv.Atoi(pathTokens[1])
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad Request"))
		return
	}

	tasksModelService, appErr := serviceinjector.GetService[tasks_model.TasksModelService]()

	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write(payload)
		return
	}

	tasks, appErr := tasksModelService.GetTasks()
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write([]byte(payload))
		return
	}

	var requestedTask *tasks_model.Task = nil
	for _, task := range tasks {
		if int(task.Id) == taskId {
			requestedTask = &task
			break
		}
	}
	taskFiles, appErr := tasksModelService.GetTaskFilesForTask(uint32(taskId))

	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write([]byte(payload))
		return
	}

	taskFileResponse := make([]api.TaskFile, 0)

	for _, taskFile := range taskFiles {
		fmtDirPart := fmt.Sprintf("problems-%s", requestedTask.Language)
		fileContent, err := os.ReadFile("./public/Tasks/" + fmtDirPart + "/" + requestedTask.TaskDir + "/src/" + taskFile.FileName)
		if err != nil {
			appErr := apperrors.NewAppError(
				apperrors.TaskHandlers_Retryable_FailedToReadFile,
				getServiceErrorOrigin("handleGetTask"),
				"error while reading the file: "+err.Error(),
			)

			w.WriteHeader(http.StatusInternalServerError)
			payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
			w.Write([]byte(payload))
			return
		}
		taskFileResponse = append(taskFileResponse, api.TaskFile{
			FileName: taskFile.FileName,
			Content:  string(fileContent),
			FileType: taskFile.FileType,
		})
	}

	if requestedTask == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Task not found"))
		return
	}

	getTaskResponse := api.GetTaskResponse{
		TaskDir:     requestedTask.TaskDir,
		TaskFiles:   taskFileResponse,
		MarkdownUrl: requestedTask.MarkdownUrl,
		Language:    requestedTask.Language,
	}

	payload, err := json.Marshal(getTaskResponse)

	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.Write(payload)
}

func handleSubmitTask(w http.ResponseWriter, req *http.Request) {
	// Ensure .temp folder exists
	if err := helpers.CheckOrCreateFolder(".temp", 0755); err != nil {
		fmt.Println("Error creating .temp folder:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	fmt.Println("Trace: created .temp folder")
	// Read the req body unmarshalled to a struct and get the username
	var decodedTask api.TaskSubmitRequest
	err := json.NewDecoder(req.Body).Decode(&decodedTask)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad Request"))
		return
	}

	appErr := createTaskFolderAndUpdateFiles(&decodedTask)
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write(payload)
		return
	}

	containerMgr, appErr := serviceinjector.GetService[containermanagerservice.ContainerManagerService]()
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write(payload)
	}

	// async await pattern
	taskCompletionNotifier := make(chan *container_manager_contracts.TaskNotification)
	containerMgr.QueueTask(container_manager_contracts.WrapTaskWithNotifier(&decodedTask, taskCompletionNotifier))
	notif := <-taskCompletionNotifier

	if notif.Err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(notif.Err)
		w.Write(payload)
		return
	}

	fmt.Println("Trace: task results", *(notif.Result))
	taskResult := GetTaskResultFromTestResult(*(notif.Result))

	if IsTaskSolved(taskResult) {
		userModelService, appErr := serviceinjector.GetService[users_model.UsersModelService]()
		if appErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
			w.Write(payload)
			return
		}

		appErr = userModelService.UpdateSolvedTask(decodedTask.UserId, strconv.Itoa(decodedTask.TaskId), "")
		if appErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
			w.Write(payload)
			return
		}
	}

	payload, err := json.Marshal(api.TaskSubmitResponse{
		TestResults: taskResult,
		DbgLogs:     *notif.DbgLogs,
	})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(apperrors.GetNoRetryableErrorResponse())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)
}

func createTaskFolderAndUpdateFiles(task *api.TaskSubmitRequest) *apperrors.AppError {
	fmt.Println("Trace: decoded JSON")
	// Ensure user folder exists
	userFolder := ".temp/" + task.UserId + "-" + task.TaskDir
	if err := helpers.CheckOrCreateFolder(userFolder, 0755); err != nil {
		return apperrors.NewAppError(
			apperrors.TaskHandler_Retryable_CreateFolderAndUpdateFilesFailed,
			getServiceErrorOrigin("createTaskFolderAndUpdateFiles: "),
			"error while creating the folder: "+err.Error(),
		)
	}

	fmt.Println("Trace: created user folder")
	// create a temporary file based on the request.Files and write the content to it
	for _, TaskFile := range task.TaskFiles {
		filePath := fmt.Sprintf("%s/%s", userFolder, TaskFile.FileName)
		err := os.WriteFile(filePath, []byte(TaskFile.Content), 0644)
		if err != nil {
			return apperrors.NewAppError(
				apperrors.TaskHandler_Retryable_CreateFolderAndUpdateFilesFailed,
				getServiceErrorOrigin("createTaskFolderAndUpdateFiles: "),
				"error while writing to the files : "+err.Error(),
			)
		}
	}

	fmt.Println("Trace: copied files to user folder")

	return nil
}
