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
		firstWord := string([]rune(strings.TrimSpace(sentences[0]))[:4])
		testResult := &api.TestResult{}
		if firstWord == FAILURE_WORD {
			testResult.IsSuccessful = false
			testResult.TestName = strings.TrimSpace(sentences[2])
			taskResult = append(taskResult, testResult)
		} else if firstWord == SUCCESS_WORD {
			testResult.IsSuccessful = true
			testResult.TestName = strings.TrimSpace(sentences[2])
			taskResult = append(taskResult, testResult)
		}
	}
	return taskResult
}
