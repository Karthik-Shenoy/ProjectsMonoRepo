package tests

import (
	"pragmatism/api"
	handlers "pragmatism/internal/handlers/http"
	"testing"
)

func TestGetTaskResultFromTestResult(t *testing.T) {
	// Arrange
	viTestResult := ` 
		RUN  v3.0.9 /usr/src/app

		✓ tests/loadbalancer.test.ts > Task-Tests:LBLB > should forward the request to a backend service
 		✓ tests/loadbalancer.test.ts > Task-Tests:LBLB > should handle errors from backend services
 		✓ tests/loadbalancer.test.ts > Task-Tests:LBLB > should consistently map the requests to the same servers for cache affinity
	`
	expected := []*api.TestResult{
		{
			IsSuccessful: true,
			TestName:     "should forward the request to a backend service",
		},

		{
			IsSuccessful: true,
			TestName:     "should handle errors from backend services",
		},
		{
			IsSuccessful: true,
			TestName:     "should consistently map the requests to the same servers for cache affinity",
		},
	}

	// Act
	result := handlers.GetTaskResultFromTestResult(viTestResult)

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
