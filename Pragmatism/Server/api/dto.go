package api

type AuthToken struct {
	Signature string `json:"signature"` // token
	Payload   string `json:"payload"`   // payload
}

type TaskSubmitRequest struct {
	UserName  string     `json:"userName"`  // User name
	TaskDir   string     `json:"taskDir"`   // Unique identifier for the task
	TaskFiles []TaskFile `json:"taskFiles"` // List of files related to the task
	Language  string     `json:"language"`  // Language of the solution
}

type GetTaskResponse struct {
	TaskDir string `json:"taskDir"` // Unique identifier for the task
	// TaskFiles contains the files related to the task
	TaskFiles []TaskFile `json:"taskFiles"` // List of files related to the task
}

const (
	FILE_TYPE_LIB  = 0
	FILE_TYPE_TASK = 1
)

type TaskFile struct {
	FileName string `json:"fileName"` // Name of the file
	Content  string `json:"content"`  // Content of the file
	FileType int    `json:"fileType"`
}

type TestResult struct {
	TestName     string `json:"testName"`
	IsSuccessful bool   `json:"isSuccessful"`
}

type TaskSubmitResponse struct {
	TestResults []*TestResult `json:"testResults"`
	DbgLogs     string        `json:"dbgLogs"`
}
