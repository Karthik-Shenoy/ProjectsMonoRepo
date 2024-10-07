package log_utils

import "fmt"

var debug bool

// SetDebug sets the debug flag
func SetDebug(d bool) {
	fmt.Println("Starting in debug mode")
	debug = d
}

// IsDebug returns the current value of the debug flag
func IsDebug() bool {
	return debug
}

func DEBUG_PRINT(log string) {
	if IsDebug() {
		fmt.Println(log)
	}
}
