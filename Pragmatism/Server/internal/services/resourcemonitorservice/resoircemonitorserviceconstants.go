package resourcemonitorservice

import (
	"time"
)

const (
	RESOURCE_POLL_INTERVAL = 5 * time.Second
)

func getServiceOriginFormDebugLogs(funcName string) string {
	return "ResourceMonitorService." + funcName
}

// log event names for the service
const (
	EventName_ResourceMonitorWorkerStarted = "ResourceMonitorWorkerStarted"
)
