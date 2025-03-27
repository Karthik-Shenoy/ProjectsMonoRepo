package tests

import (
	"pragmatism/api"
	handlers "pragmatism/internal/handlers/http"
	"testing"
)

func TestGetTaskResultFromTestResult(t *testing.T) {
	// Arrange
	jestTestResult := "FAIL tests/loadbalancer.test.ts\n  Task-Tests:LBLB\n\t✕ should forward the request to a backend service (7 ms)\n\t✕ should handle errors from backend services (1 ms)\n\t✕ should consistently map the requests to the same servers for cache affinity (1 ms)\n Task-Tests:LBLB › should forward the request to a backend service"
	expected := []*api.TestResult{
		{
			IsSuccessful: false,
			TestName:     "should forward the request to a backend service (7 ms)",
		},

		{
			IsSuccessful: false,
			TestName:     "should handle errors from backend services (1 ms)",
		},
		{
			IsSuccessful: false,
			TestName:     "should consistently map the requests to the same servers for cache affinity (1 ms)",
		},
	}

	// Act
	result := handlers.GetTaskResultFromTestResult(jestTestResult)

	// Assert
	if len(result) != 3 {
		t.Errorf("Expected length of the result to be 3 but got %v", len(result))
		return
	}

	for i, expectedResult := range expected {
		if expectedResult.IsSuccessful != result[i].IsSuccessful || expectedResult.TestName != result[i].TestName {
			t.Errorf("For test result %v, Expected %v but got %v", i, expectedResult, result[i])
		}
	}
}
