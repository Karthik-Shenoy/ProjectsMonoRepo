package telemetryservice

import (
	"context"
	"pragmatism/internal/apperrors"
	"sync"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/log"
	"go.opentelemetry.io/otel/metric"
	sdklog "go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
	"go.opentelemetry.io/otel/trace"
)

type TelemetryService struct {
	tracer   trace.Tracer
	logger   log.Logger
	meter    metric.Meter
	logMutex sync.Mutex
}

func (service *TelemetryService) init() (func(context.Context) error, error) {
	tracerCtx := context.Background()
	loggerCtx := context.Background()

	traceExporter, err := otlptracehttp.New(tracerCtx,
		otlptracehttp.WithEndpoint(getOtelEndPointUrl()),
		otlptracehttp.WithInsecure(),
	)

	if err != nil {
		return nil, err
	}

	logExporter, err := otlploghttp.New(
		loggerCtx,
		otlploghttp.WithEndpoint(getOtelEndPointUrl()),
		otlploghttp.WithInsecure(),
	)

	if err != nil {
		return nil, err
	}

	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(traceExporter),
		sdktrace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(TELEMETRY_SERVICE_NAME),
		)),
	)

	loggerProvider := sdklog.NewLoggerProvider(
		sdklog.WithProcessor(sdklog.NewBatchProcessor(logExporter)),
		sdklog.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(TELEMETRY_SERVICE_NAME),
		)),
	)

	otel.SetTracerProvider(tracerProvider)

	// init tracer
	service.tracer = otel.Tracer(TELEMETRY_SERVICE_NAME)
	service.logger = loggerProvider.Logger(TELEMETRY_SERVICE_NAME)
	service.meter = otel.Meter(TELEMETRY_SERVICE_NAME)

	return tracerProvider.Shutdown, nil
}

func (service *TelemetryService) SendTrace() {}

// [ DO NOT USE !!! ] we don't have a tracer present as of now
func (service *TelemetryService) TraceError(handlerName string, ctx context.Context, err apperrors.AppError) {
	service.logMutex.Lock()
	defer service.logMutex.Unlock()

	_, span := service.tracer.Start(ctx, handlerName)
	defer span.End()

	span.RecordError(err.Err())
	span.SetAttributes(
		attribute.KeyValue{
			Key:   "error.type",
			Value: attribute.StringValue(err.Type),
		},
		attribute.KeyValue{
			Key:   "error.Origin",
			Value: attribute.StringValue(err.Origin),
		},
		attribute.KeyValue{
			Key:   "error.Message",
			Value: attribute.StringValue(err.Message),
		},
	)
	span.SetStatus(codes.Error, "")
}

func (service *TelemetryService) SendLog(severity log.Severity, origin string, eventName string, message string) {
	service.logMutex.Lock()
	defer service.logMutex.Unlock()

	todoCtx := context.TODO()

	record := log.Record{}
	record.SetTimestamp(time.Now())
	record.SetObservedTimestamp(time.Now())
	record.SetSeverity(severity)
	// record.SetSeverityText()
	record.SetEventName(eventName)
	record.SetBody(log.StringValue(message))
	service.logger.Emit(todoCtx, record)

}

func (service *TelemetryService) LogError(err *apperrors.AppError) {
	service.logMutex.Lock()
	defer service.logMutex.Unlock()

	appErrorTrace := err.ErrorTrace()

	errorTraceSlice := appErrorTrace.AppErrorsTrace
	otelSliceAttribute := make([]log.Value, 0)
	for _, itrErr := range errorTraceSlice {
		otelSliceAttribute = append(otelSliceAttribute, log.StringValue(itrErr.Type))
	}

	todoCtx := context.TODO()
	record := log.Record{}
	record.SetTimestamp(time.Now())
	record.SetObservedTimestamp(time.Now())
	record.SetSeverity(log.SeverityError)
	record.SetSeverityText(SEVERITY_ERROR)
	record.SetEventName(err.Type)
	record.AddAttributes(
		log.KeyValue{
			Key:   "error.ErrorTrace",
			Value: log.SliceValue(otelSliceAttribute...),
		},
		log.KeyValue{
			Key:   "error.Origin",
			Value: log.StringValue(err.Origin),
		},
		log.KeyValue{
			Key:   "error.Message",
			Value: log.StringValue(err.Message),
		},
	)
	record.SetBody(log.StringValue(err.String()))
	service.logger.Emit(todoCtx, record)
}

func (service *TelemetryService) GetMeter() metric.Meter {
	return service.meter
}

var singletonMutex sync.Mutex
var instance *TelemetryService

func GetInstance() *TelemetryService {
	singletonMutex.Lock()
	defer singletonMutex.Unlock()
	if instance == nil {
		instance = &TelemetryService{}
		_, err := instance.init()
		if err != nil {
			panic("Failed to initialize TelemetryService: " + err.Error())
		}
	}
	return instance
}
