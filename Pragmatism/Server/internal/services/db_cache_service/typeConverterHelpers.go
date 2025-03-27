package db_cache_service

import "strconv"

func getBoolFromBytes(p []byte) bool {
	if len(p) == 0 {
		return false
	}
	if p[0] == 1 {
		return true
	} else if p[0] == 0 {
		return false
	}
	return false
}

func getIntFromBytes(p []byte) int {
	result, err := strconv.Atoi(string(p))
	if err != nil {
		return 0
	}
	return result
}

func getStringFromBytes(p []byte) string {
	if len(p) == 0 {
		return ""
	}
	result := string(p)
	return result
}
