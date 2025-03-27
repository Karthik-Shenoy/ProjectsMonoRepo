package tests

import (
	"pragmatism/internal/services/containermanagerservice"
	"testing"
)

func TestIsContainerRunningForTask(t *testing.T) {
	// Arrange
	taskDir := "lblb"
	expected := true

	// Act
	isRunning, err := containermanagerservice.IsContainerRunningForTask(taskDir)

	// Assert
	if err != nil {
		t.Fatalf("Expected no error, but got: %v", err)
	}
	if isRunning != expected {
		t.Errorf("Expected %v, but got %v", expected, isRunning)
	}
}
