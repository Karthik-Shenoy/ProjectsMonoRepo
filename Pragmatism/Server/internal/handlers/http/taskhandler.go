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

	tasks_model "pragmatism/internal/models/tasksmodel"

	"strconv"
	"strings"
)

func getServiceErrorOrigin(funcName string) string {
	return "task_handler." + funcName
}

func InitTaskHandlers() {
	http.HandleFunc("GET /tasks", middlewares.CorsMiddleware(HandleGetTasks, http.MethodGet))
	http.HandleFunc("GET /tasks/", middlewares.CorsMiddleware(handleGetTask, http.MethodGet))
	http.HandleFunc("POST /tasks/", middlewares.CorsMiddleware(handleSubmitTask, http.MethodPost))
}

func HandleGetTasks(w http.ResponseWriter, req *http.Request) {
	pathTokens := getPathTokens(req)

	// Check if the path is valid and let other handlers handle it
	if len(pathTokens) > 1 || pathTokens[0] != "tasks" {
		return
	}

	problems, err := tasks_model.GetTasks()

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	payload, err := json.Marshal(problems)

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

	tasks, err := tasks_model.GetTasks()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	taskDir := ""
	for _, task := range tasks {
		if int(task.Id) == taskId {
			taskDir = task.TaskDir
			break
		}
	}
	taskFiles, err := tasks_model.GetTaskFilesForTask(uint32(taskId))

	if err != nil {
		fmt.Println("Error getting task files:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	taskFileResponse := make([]api.TaskFile, 0)

	for _, taskFile := range taskFiles {
		fileContent, err := os.ReadFile("./public/Tasks/" + taskDir + "/src/" + taskFile.FileName)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			return
		}
		taskFileResponse = append(taskFileResponse, api.TaskFile{
			FileName: taskFile.FileName,
			Content:  string(fileContent),
			FileType: taskFile.FileType,
		})
	}

	getTaskResponse := api.GetTaskResponse{
		TaskDir:   taskDir,
		TaskFiles: taskFileResponse,
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
		fmt.Println("Error decoding JSON:", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad Request"))
		return
	}

	appErr := createTaskFolderAndUpdateFiles(&decodedTask)
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(appErr.GetHTTPResponseMsg())
	}

	containerMgr := containermanagerservice.GetInstance()

	taskCompletionNotifier := make(chan *container_manager_contracts.TaskNotification)
	containerMgr.QueueTask(container_manager_contracts.WrapTaskWithNotifier(&decodedTask, taskCompletionNotifier))
	notif := <-taskCompletionNotifier

	if notif.Err != nil {
		fmt.Println(notif.Err.Err())
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(notif.Err.GetHTTPResponseMsg())
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Println("Trace: task results", *(notif.Result))
	taskResult := GetTaskResultFromTestResult(*(notif.Result))

	payload, err := json.Marshal(api.TaskSubmitResponse{
		TestResults: taskResult,
		DbgLogs:     *notif.DbgLogs,
	})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(apperrors.GetNoRetryableErrorResponse())
		return
	}

	w.Write(payload)
}

func createTaskFolderAndUpdateFiles(task *api.TaskSubmitRequest) *apperrors.AppError {
	fmt.Println("Trace: decoded JSON")
	// Ensure user folder exists
	userFolder := ".temp/" + task.UserName + "-" + task.TaskDir
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
