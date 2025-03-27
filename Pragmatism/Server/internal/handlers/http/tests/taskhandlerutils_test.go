package tests

import (
	"pragmatism/api"
	handlers "pragmatism/internal/handlers/http"
	"testing"
)

func TestGetTaskResultFromTestResult(t *testing.T) {
	// Arrange
	jestTestResult := "❯ tests/loadbalancer.test.ts (3 tests | 3 failed) 13ms\n\t  × Task-Tests:LBLB > should forward the request to a backend service 9ms\n\t→ expected \"spy\" to be called with arguments: [ Array(2) ]\nReceived:\n\tNumber of calls: 0\n\t\t × Task-Tests:LBLB > should handle errors from backend services 1ms\n\t→ expected \"spy\" to be called with arguments: [ Error: Backend error ]\nReceived:\n\tNumber of calls: 0\n\n\t× Task-Tests:LBLB > should consistently map the requests to the same servers for cache affinity 1ms\n\t→ expected \"spy\" to be called 10 times, but got 0 times"
	expected := []*api.TestResult{
		{
			IsSuccessful: false,
			TestName:     "should forward the request to a backend service 9ms",
		},

		{
			IsSuccessful: false,
			TestName:     "should handle errors from backend services 1ms",
		},
		{
			IsSuccessful: false,
			TestName:     "should consistently map the requests to the same servers for cache affinity 1ms",
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
