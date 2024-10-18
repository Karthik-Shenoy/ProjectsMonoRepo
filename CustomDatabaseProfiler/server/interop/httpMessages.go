package interop

type QueryMessage struct {
	Query    string
	ClientId string
}

type ClientHeartBeat struct {
	ClientId string
}
