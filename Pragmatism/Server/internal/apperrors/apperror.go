package apperrors

import (
	"encoding/json"
	"fmt"
	"pragmatism/api"
	"strings"
)

type AppError struct {
	// message type from app errors enum
	Type string `json:"type"`
	// origin of the error, module + function name
	Origin string `json:"origin"`
	// message describing the error
	Message string `json:"message"`
	// creates a linked list like structure, helps us bubble up the error
	// gives good enugh context for easy debugging
	WrappedError *AppError
}

type AppErrorTrace struct {
	// list derived from AppError.type for each error along the stack
	Errors []string `json:"errors"`
	//- [ WARNING!!! ] do not send this to client, error trace similar to stack trace |
	//- use only for logs for effective debugging
	AppErrorsTrace []*AppError
}

func NewAppError(errType, origin, message string) *AppError {
	return &AppError{
		Type:    errType,
		Origin:  origin,
		Message: message,
	}
}

func NewAppErrorFromLowerLayerError(errType, origin, message string, err *AppError) *AppError {
	return &AppError{
		Type:         errType,
		Origin:       origin,
		Message:      message,
		WrappedError: err,
	}
}

func (e *AppError) Err() error {
	return fmt.Errorf("%s: {Type: %s, Message: %s}", e.Origin, e.Type, e.Message)
}

func (e *AppError) String() string {
	return fmt.Sprintf("%s: {Type: %s, Message: %s}", e.Origin, e.Type, e.Message)
}

func (e *AppError) ErrorTrace() *AppErrorTrace {
	errorTrace := &AppErrorTrace{
		Errors:         make([]string, 0),
		AppErrorsTrace: make([]*AppError, 0),
	}
	itrAppErrors := e
	for itrAppErrors != nil {
		errorTrace.AppErrorsTrace = append(errorTrace.AppErrorsTrace, itrAppErrors)
		errorTrace.Errors = append(errorTrace.Errors, itrAppErrors.Type)
		itrAppErrors = itrAppErrors.WrappedError
	}
	return errorTrace
}

func (e *AppError) GetHTTPResponseMsg() ([]byte, *AppError) {
	itrAppErrors := e

	response := api.HttpHandlerErrorResponse{
		ShouldRetry: true,
	}

	for itrAppErrors != nil {
		errTokens := strings.Split(e.Type, "_")

		if len(errTokens) != 3 || errTokens[1] == "NonRetryable" {
			response.ShouldRetry = false
			break
		}
		itrAppErrors = itrAppErrors.WrappedError
	}

	p, err := json.Marshal(response)
	if err != nil {
		// strange error: log
		return []byte(""), NewAppError(
			AppError_NonRetryable_FailedToMarshallResponse,
			"AppError.GetHTTPResponseMsg",
			fmt.Sprintf("Failed to marshall response: %s", err.Error()),
		)
	}
	return p, nil

}
