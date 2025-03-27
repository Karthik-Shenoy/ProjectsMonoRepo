package tasks_model

import (
	"encoding/json"
	"fmt"
	"pragmatism/internal/services/db_cache_service"
)

type Task struct {
	Id          uint32 `json:"id"`          // Unique identifier for the problem
	Title       string `json:"title"`       // Title of the problem
	Description string `json:"description"` // Description of the problem
	NumSolves   uint32 `json:"numSolves"`   // Number of solves for the problem
	MarkdownUrl string `json:"markdownUrl"` // URL to the markdown file for the problem
	TaskDir     string `json:"taskDir"`     // Folder for the container
}

type TaskFile struct {
	TaskId   uint32 `json:"taskId"`   // Unique identifier for the task
	FileName string `json:"fileName"` // Name of the file
	FileType int    `json:"fileType"` // Type of the file
}

func GetTasks() ([]Task, error) {
	dbCacheInstance, err := db_cache_service.GetInstance()
	problems := make([]Task, 0)

	if err != nil {
		// return empty slice
		return problems, err
	}

	payload, err := dbCacheInstance.Query("SELECT id, title, description, num_solves, markdown_url, task_dir FROM tasks")

	if err != nil {
		return problems, err
	}

	err = json.Unmarshal(payload, &problems)

	if err != nil {
		return problems, err
	}

	return problems, nil
}

func GetTaskFilesForTask(taskId uint32) ([]TaskFile, error) {
	cacheInstance, err := db_cache_service.GetInstance()

	if err != nil {
		return nil, err
	}

	payload, err := cacheInstance.Query(fmt.Sprintf("SELECT * FROM task_files WHERE task_id = %d", taskId))

	if err != nil {
		return nil, err
	}

	taskFiles := make([]TaskFile, 0)
	json.Unmarshal(payload, &taskFiles)

	return taskFiles, nil
}
