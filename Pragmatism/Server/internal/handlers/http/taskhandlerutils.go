package handlers

import (
	"pragmatism/api"
	"strings"
)

const SUCCESS_INDICATOR_UNICODE_CHAR = '\u2713'
const FAILURE_INDICATOR_UNICODE_CHAR = '\u00D7'

const FAILURE_WORD = "FAIL"
const SUCCESS_WORD = "PASS"

func GetTaskResultFromTestResult(testResult string) []*api.TestResult {
	taskResult := make([]*api.TestResult, 0)
	testResultLines := strings.Split(testResult, "\n")
	for _, line := range testResultLines {
		sentences := strings.Split(line, "> ")
		if len(sentences) < 3 {
			continue
		}
		firstWord := strings.TrimSpace(sentences[0])
		if len(firstWord) < 1 {
			continue
		}
		firstRune := []rune(firstWord)[0]
		testResult := &api.TestResult{}
		if firstRune == FAILURE_INDICATOR_UNICODE_CHAR {
			testResult.IsSuccessful = false
			testResult.TestName = strings.TrimSpace(sentences[2])
			taskResult = append(taskResult, testResult)
		} else if firstRune == SUCCESS_INDICATOR_UNICODE_CHAR {
			testResult.IsSuccessful = true
			testResult.TestName = strings.TrimSpace(sentences[2])
			taskResult = append(taskResult, testResult)
		}
	}
	return taskResult
}

func IsTaskSolved(taskResult []*api.TestResult) bool {
	for _, result := range taskResult {
		if !result.IsSuccessful {
			return false
		}
	}
	return true
}
