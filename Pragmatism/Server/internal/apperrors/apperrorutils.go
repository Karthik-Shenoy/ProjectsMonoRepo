package apperrors

import "encoding/json"

func GetNoRetryableErrorResponse() []byte {
	response := HttpHandlerErrorResponse{
		ShouldRetry: false,
	}

	p, err := json.Marshal(response)
	if err != nil {
		// strange error: log
		return []byte("")
	}
	return p
}
