package tests

import (
	"pragmatism/api"
	handlers "pragmatism/internal/handlers/http"
	"testing"
)

func TestGetTaskResultFromTestResult(t *testing.T) {
	// Arrange
	jestTestResult := " FAIL  tests/loadbalancer.test.ts > Task-Tests:LBLB > should forward the request to a backend service\n\t\n\tAssertionError: expected \"spy\" to be called with arguments: [ Array(2) ]Received:\nNumber of calls: 0\n\t❯ tests/loadbalancer.test.ts:52:45\n50|         await loadbalancer.onRequest(request, mockResponseWriter);\n\t FAIL  tests/loadbalancer.test.ts > Task-Tests:LBLB > should handle errors from backend services\n\tAssertionError: expected \"spy\" to be called with arguments: [ Error: Backend error ]\nceived:\n\tNumber of calls: 0\n \tFAIL  tests/loadbalancer.test.ts > Task-Tests:LBLB > should consistently map the requests to the same servers for cache affinity\nAssertionError: expected \"spy\" to be called 10 times, but got 0 times"
	expected := []*api.TestResult{
		{
			IsSuccessful: false,
			TestName:     "should forward the request to a backend service",
		},

		{
			IsSuccessful: false,
			TestName:     "should handle errors from backend services",
		},
		{
			IsSuccessful: false,
			TestName:     "should consistently map the requests to the same servers for cache affinity",
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
