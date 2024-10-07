package interop

type UdpMessage struct {
	CorrelationId uint32 `json:"correlationId"`
	Payload       string `json:"payload"`
}

type DatabaseProfileMessage struct {
	QueryParseTime     int32 `json:"queryParseTime"`
	QueryExecutionTime int32 `json:"queryExecutionTime"`
}
