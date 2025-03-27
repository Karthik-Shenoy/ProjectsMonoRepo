package handlers

import (
	"pragmatism/api"
	"strings"
)

const SUCCESS_INDICATOR_UNICODE_CHAR = '\u2713'
const FAILURE_INDICATOR_UNICODE_CHAR = '\u2715'

func GetTaskResultFromTestResult(testResult string) []*api.TestResult {
	taskResult := make([]*api.TestResult, 0)
	testResultLines := strings.Split(testResult, "\n")
	for _, line := range testResultLines {
		for index, c := range line {
			testResult := &api.TestResult{}
			if c == FAILURE_INDICATOR_UNICODE_CHAR {
				testResult.IsSuccessful = false
				testResult.TestName = string([]rune(line)[index+2:])
				taskResult = append(taskResult, testResult)
				break
			} else if c == SUCCESS_INDICATOR_UNICODE_CHAR {
				testResult.IsSuccessful = true
				testResult.TestName = string([]rune(line)[index+2:])
				taskResult = append(taskResult, testResult)
				break
			}

		}
	}
	return taskResult
}
