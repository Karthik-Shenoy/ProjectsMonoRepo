package helpers

import (
	"fmt"
	"io"
	"os/exec"
	"pragmatism/internal/apperrors"
	"strings"
	"time"
)

type AsyncReadStreamResult struct {
	Result string
	Err    error
}

type RunCmdAndGetStdFilesResult struct {
	// nil if error
	StdOut *string
	// If Err check StdErr, nil if handled error
	StdErr *string
	Err    error
}

// [local helper] returns service error origin string for shared helpers
func getServiceErrorOrigin(funcName string) string {
	return "shared_helper." + funcName
}

func ConvertSnakeToCamelCase(snakeStr string) string {
	tokens := strings.Split(snakeStr, "_")
	result := tokens[0]
	for _, tok := range tokens[1:] {
		result += strings.ToUpper(tok[:1]) + tok[1:]
	}
	return result
}

func GetCurrentUnixTime() int64 {
	return time.Now().Unix()
}

func AsyncReadStream(r *io.ReadCloser, ch chan<- *AsyncReadStreamResult) {
	defer close(ch)
	p, err := io.ReadAll(*r)

	if err != nil {
		ch <- &AsyncReadStreamResult{
			Result: "",
			Err: apperrors.NewAppError(
				apperrors.SharedHelpers_Retryable_RunCommandFailed,
				getServiceErrorOrigin("AsyncReadStream"),
				"failed to read stream, msg"+err.Error(),
			).Err(),
		}
		return
	}

	ch <- &AsyncReadStreamResult{
		Result: string(p),
		Err:    nil,
	}
}

// returns stdOut and stdErr respectively
func RunCmdAndGetStdFiles(name string, arg ...string) *RunCmdAndGetStdFilesResult {
	cmdHandle := exec.Command(name, arg...)
	cmdStdOut, errStdOut := cmdHandle.StdoutPipe()
	cmdStdErr, errStdErr := cmdHandle.StderrPipe()
	if errStdOut != nil || errStdErr != nil {
		return &RunCmdAndGetStdFilesResult{
			Err: apperrors.NewAppError(
				apperrors.SharedHelpers_Retryable_RunCommandFailed,
				getServiceErrorOrigin("RunCmdAndGetStdFiles"),
				"failed to get stdout and stderr pipes",
			).Err(),
		}
	}

	if err := cmdHandle.Start(); err != nil {
		return &RunCmdAndGetStdFilesResult{
			Err: apperrors.NewAppError(
				apperrors.SharedHelpers_Retryable_RunCommandFailed,
				getServiceErrorOrigin("RunCmdAndGetStdFiles"),
				"cmdHandle.Start() failed, Error: "+err.Error(),
			).Err(),
		}
	}
	var stdOutReaderChan = make(chan *AsyncReadStreamResult)
	var stdErrReaderChan = make(chan *AsyncReadStreamResult)
	go AsyncReadStream(&cmdStdOut, stdOutReaderChan)
	go AsyncReadStream(&cmdStdErr, stdErrReaderChan)

	if err := cmdHandle.Wait(); err != nil {
		stdErrResult := <-stdErrReaderChan
		if stdErrResult.Err == nil {
			return &RunCmdAndGetStdFilesResult{
				StdOut: nil,
				StdErr: &stdErrResult.Result,
				Err: apperrors.NewAppError(
					apperrors.SharedHelpers_Retryable_RunCommandFailed,
					getServiceErrorOrigin("RunCmdAndGetStdFiles"),
					fmt.Sprintf(
						"cmdHandle.Wait() failed: %s, stdErr was returned to the upper layers",
						err.Error()),
				).Err(),
			}
		}

		return &RunCmdAndGetStdFilesResult{
			StdOut: nil,
			StdErr: nil,
			Err: apperrors.NewAppError(
				apperrors.SharedHelpers_Retryable_RunCommandFailed,
				getServiceErrorOrigin("RunCmdAndGetStdFiles"),
				fmt.Sprintf(
					"cmdHandle.Wait() failed: %s, stdErr was not returned to the upper layers",
					err.Error()),
			).Err(),
		}
	}

	stdOutResult := <-stdOutReaderChan
	if stdOutResult.Err != nil {
		return &RunCmdAndGetStdFilesResult{
			Err: apperrors.NewAppError(
				apperrors.SharedHelpers_Retryable_RunCommandFailed,
				getServiceErrorOrigin("RunCmdAndGetStdFiles"),
				"Failed to read command stdout or stderr, msg:"+stdOutResult.Err.Error(),
			).Err(),
		}
	}

	return &RunCmdAndGetStdFilesResult{
		StdOut: &stdOutResult.Result,
		StdErr: nil,
		Err:    nil,
	}
}
