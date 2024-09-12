package interop

type JoinRoomResponse struct {
	PlayersList []string `json:"playerList"`
}

type IsWordValidRequest struct {
	Word string `json:"word"`
}

type IsWordValidResponse struct {
	IsValid bool `json:"isValid"`
}
