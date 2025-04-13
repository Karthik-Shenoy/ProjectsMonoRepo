package resourcemonitorservice

import (
	"context"
	"fmt"
	"pragmatism/internal/services/telemetryservice"
	"runtime"
	"sync"
	"time"

	log "go.opentelemetry.io/otel/log"
	"go.opentelemetry.io/otel/metric"
)

func StartResourceMonitoringWorker(telemetryService *telemetryservice.TelemetryService) {
	meter := telemetryService.GetMeter()

	// Create metric instruments
	var err error
	memAllocMetric, err := meter.Int64ObservableGauge("process.runtime.go.mem.alloc", metric.WithDescription("Total bytes allocated for heap objects"))
	if err != nil {
		fmt.Printf("failed to create mem.alloc observable gauge: %v", err)
	}
	memTotalAllocMetric, err := meter.Int64ObservableGauge("process.runtime.go.mem.total_alloc", metric.WithDescription("Total cumulative bytes allocated"))
	if err != nil {
		fmt.Printf("failed to create mem.total_alloc observable gauge: %v", err)
	}
	memSysMetric, err := meter.Int64ObservableGauge("process.runtime.go.mem.sys", metric.WithDescription("Total bytes of memory obtained from the OS"))
	if err != nil {
		fmt.Printf("failed to create mem.sys observable gauge: %v", err)
	}
	memNumGCMetric, err := meter.Int64ObservableCounter("process.runtime.go.gc.count", metric.WithDescription("Number of completed GC cycles"))
	if err != nil {
		fmt.Printf("failed to create gc.count observable counter: %v", err)
	}
	cpuUsageMetric, err := meter.Float64ObservableGauge("process.runtime.go.cpu.usage", metric.WithDescription("Fraction of CPU used by the Go program (approximate)"))
	if err != nil {
		fmt.Printf("failed to create cpu.usage observable gauge: %v", err)
	}
	gcPauseMetric, err := meter.Int64Histogram("process.runtime.go.gc.pause", metric.WithDescription("Duration of individual GC pauses in nanoseconds"))
	if err != nil {
		fmt.Printf("failed to create gc.pause histogram: %v", err)
	}

	// Create observable callbacks
	_, err = meter.RegisterCallback(func(ctx context.Context, o metric.Observer) error {
		var m runtime.MemStats
		runtime.ReadMemStats(&m)
		o.ObserveInt64(memAllocMetric, int64(m.Alloc))
		o.ObserveInt64(memTotalAllocMetric, int64(m.TotalAlloc))
		o.ObserveInt64(memSysMetric, int64(m.Sys))
		o.ObserveInt64(memNumGCMetric, int64(m.NumGC))

		// Approximate CPU usage (simplistic and might not be accurate in all scenarios)
		// A more accurate approach would involve tracking CPU time over intervals.
		o.ObserveFloat64(cpuUsageMetric, float64(runtime.NumGoroutine())/float64(runtime.GOMAXPROCS(0)))
		return nil
	}, memAllocMetric, memTotalAllocMetric, memSysMetric, memNumGCMetric, cpuUsageMetric)
	if err != nil {
		fmt.Printf("failed to register memory and CPU usage callback: %v", err)
	}

	// Start a worker to periodically capture GC pause information
	var lastGCStats runtime.MemStats
	var gcPauseMu sync.Mutex

	// need to think on how contexts should me managed across telemetry and resource monitor service
	todoCtx := context.TODO()

	go func() {
		ticker := time.NewTicker(RESOURCE_POLL_INTERVAL)
		defer ticker.Stop()

		for range ticker.C {
			var currentGCStats runtime.MemStats
			runtime.ReadMemStats(&currentGCStats)

			gcPauseMu.Lock()
			if lastGCStats.NumGC < currentGCStats.NumGC {
				numNewGC := currentGCStats.NumGC - lastGCStats.NumGC
				if numNewGC > 0 {
					// GcPauseNs is a circular buffer of recent GC pause durations.
					// We need to iterate through it based on the number of new GCs.
					pauseIndex := (currentGCStats.NumGC + 255) % 256 // Assuming GcPauseNs is [256]uint64
					for i := uint32(0); i < numNewGC; i++ {
						pause := currentGCStats.PauseNs[ModuloSubtract(pauseIndex, i)]
						gcPauseMetric.Record(todoCtx, int64(pause))
					}
				}
			}
			lastGCStats = currentGCStats
			gcPauseMu.Unlock()
		}
	}()

	telemetryService.SendLog(
		log.SeverityDebug,
		getServiceOriginFormDebugLogs("StartResourceMonitoringWorker"),
		EventName_ResourceMonitorWorkerStarted,
		fmt.Sprintf("Resource Monitoring Worker started. Polling every %s...\n", RESOURCE_POLL_INTERVAL), /* message */
	)

}

func ModuloSubtract(a uint32, b uint32) uint32 {
	// 0 - 4 == 252 basically 0 + (n * 256 - b))
	var modularAdjust = 256 - (b % 256)
	return (a + modularAdjust) + 256
}
