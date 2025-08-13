package containermanagerservice

import (
	"fmt"
)

const SLEEP_TIME_MS = 500 //ms
const MAX_CONCURRENT_CONTAINERS = 20

const USER_FILES_TEMP_DIR = "./.temp"
const CONTAINER_NAME_PREFIX = "task-container-"
const IMAGE_NAME_PREFIX = "task-image-"
const LOG_FILE_PATH = "/usr/src/app/console.log"

const TASK_TEST_IDENTIFIER_PREFIX = "Task-Tests"

func GetTaskDestPath(taskDir string) string {
	return fmt.Sprintf("usr/src/app/%s/src/", taskDir)
}
