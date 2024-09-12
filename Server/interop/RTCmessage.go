package interop

type MessageType = int8

const (
	MESSAGE_TYPE_INIT MessageType = iota
	MESSAGE_TYPE_GAME_START
	MESSAGE_TYPE_WORD
	MESSAGE_TYPE_DEATH
	MESSAGE_TYPE_GAME_START_BROADCAST
)

type RTCMessageInit struct {
	MessageType MessageType `json:"messageType"`
	UserName    string      `json:"userName"`
	RoomId      string      `json:"roomId"`
}

type RTCMessageWordMessage struct {
	MessageType MessageType `json:"messageType"`
	Word        string      `json:"word"`
	UserName    string      `json:"userName"`
}

type RTCDeathMessage struct {
	MessageType MessageType `json:"messageType"`
	UserName    string      `json:"userName"`
}

type RTCGameStartMessage struct {
	MessageType MessageType `json:"messageType"`
}

type RTCGameStartBroadcastMessage struct {
	MessageType MessageType    `json:"messageType"`
	PositionMap map[string]int `json:"positionMap"`
}

type RTCMessageDiscriminator struct {
	MessageType MessageType `json:"messageType"`
}
