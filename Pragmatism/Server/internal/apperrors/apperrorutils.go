package apperrors

import (
	"encoding/json"
	"pragmatism/api"
)

func GetNoRetryableErrorResponse() []byte {
	response := api.HttpHandlerErrorResponse{
		ShouldRetry: false,
	}

	p, err := json.Marshal(response)
	if err != nil {
		// strange error: log
		return []byte("")
	}
	return p
}
