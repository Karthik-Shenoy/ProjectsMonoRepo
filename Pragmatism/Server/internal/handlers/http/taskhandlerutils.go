package handlers

import (
	"pragmatism/api"
	"strings"
)

const SUCCESS_INDICATOR_UNICODE_CHAR = '\u2713'
const FAILURE_INDICATOR_UNICODE_CHAR = '\u00D7'

func GetTaskResultFromTestResult(testResult string) []*api.TestResult {
	taskResult := make([]*api.TestResult, 0)
	testResultLines := strings.Split(testResult, "\n")
	for _, line := range testResultLines {
		sentences := strings.Split(line, "> ")
		if len(sentences) < 2 {
			continue
		}
		firstChar := []rune(strings.TrimSpace(sentences[0]))[0]
		testResult := &api.TestResult{}
		if firstChar == FAILURE_INDICATOR_UNICODE_CHAR {
			testResult.IsSuccessful = false
			testResult.TestName = strings.TrimSpace(sentences[1])
			taskResult = append(taskResult, testResult)
		} else if firstChar == SUCCESS_INDICATOR_UNICODE_CHAR {
			testResult.IsSuccessful = true
			testResult.TestName = strings.TrimSpace(sentences[1])
			taskResult = append(taskResult, testResult)
		}
	}
	return taskResult
}
