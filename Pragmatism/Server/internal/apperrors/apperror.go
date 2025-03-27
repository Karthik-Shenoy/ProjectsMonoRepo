package apperrors

import (
	"encoding/json"
	"fmt"
	"strings"
)

type AppError struct {
	// message type from app errors enum
	Type string `json:"type"`
	// origin of the error, module + function name
	Origin string `json:"origin"`
	// message describing the error
	Message string `json:"message"`
}

type HttpHandlerErrorResponse struct {
	ShouldRetry bool `json:"shouldRetry"`
}

func NewAppError(errType, origin, message string) *AppError {
	return &AppError{
		Type:    errType,
		Origin:  origin,
		Message: message,
	}
}

func (e *AppError) Err() error {
	return fmt.Errorf("%s: {Type: %s, Message: %s}", e.Origin, e.Type, e.Message)
}

func (e *AppError) String() string {
	return fmt.Sprintf("%s: {Type: %s, Message: %s}", e.Origin, e.Type, e.Message)
}

func (e *AppError) GetHTTPResponseMsg() []byte {
	errTokens := strings.Split(e.Type, "-")
	if len(errTokens) != 3 {
		return []byte("")
	}

	response := HttpHandlerErrorResponse{
		ShouldRetry: false,
	}
	if errTokens[1] == "Retryable" {
		response.ShouldRetry = true
		p, err := json.Marshal(response)
		if err != nil {
			// strange error: log
			return []byte("")
		}
		return p
	} else {
		response.ShouldRetry = false
		p, err := json.Marshal(response)
		if err != nil {
			// strange error: log
			return []byte("")
		}
		return p
	}
}
