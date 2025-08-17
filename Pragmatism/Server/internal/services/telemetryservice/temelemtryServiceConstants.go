package telemetryservice

import "pragmatism/internal/cmdflags"

func getOtelEndPointUrl() string {
	if cmdflags.IsDevMode() {
		return "localhost:4318"
	}
	return "localhost:4138"
}

const TELEMETRY_SERVICE_NAME = "PragmatismWebApp.TelemetryService"

const (
	SEVERITY_WARNING = "Warning"
	SEVERITY_INFO    = "Info"
	SEVERITY_ERROR   = "Error"
)
