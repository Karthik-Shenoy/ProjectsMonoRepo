package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"word-roulette/game"
	"word-roulette/interop"
	"word-roulette/rtc"
)

type RoomController struct {
	roomMgr *rtc.RoomManager
}

type RoomRequest struct {
	UserName string `json:"userName"`
	RoomId   string `json:"roomId"`
}

var singletonMutex sync.Mutex
var controllerInstance *RoomController = nil

func HandleRoomCreate(w http.ResponseWriter, req *http.Request) {
	roomController := getInstance()

	roomRequest := RoomRequest{}
	json.NewDecoder(req.Body).Decode(&roomRequest)

	if roomRequest.RoomId == "" || roomRequest.UserName == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := roomController.roomMgr.CreateRoom(roomRequest.RoomId)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	err = roomController.roomMgr.AddUser(roomRequest.RoomId, game.NewPlayer(roomRequest.UserName))
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func HandleRoomJoin(w http.ResponseWriter, req *http.Request) {
	roomController := getInstance()

	roomRequest := RoomRequest{}
	json.NewDecoder(req.Body).Decode(&roomRequest)

	rtcClients, err := roomController.roomMgr.GetUsersInRoom(roomRequest.RoomId)

	if err != nil {
		fmt.Println("api.HandleRoomJoin:", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = roomController.roomMgr.AddUser(roomRequest.RoomId, game.NewPlayer(roomRequest.UserName))
	if err != nil {
		fmt.Println("api.HandleRoomJoin:", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	playersList := make([]string, 0)
	for _, client := range rtcClients {
		playersList = append(playersList, client.GetName())
	}

	roomJoinResponse := interop.JoinRoomResponse{
		PlayersList: playersList,
	}

	payload, err := json.Marshal(roomJoinResponse)

	if err != nil {
		fmt.Println("api.HandleRoomJoin:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)

}

func getInstance() *RoomController {
	singletonMutex.Lock()
	if controllerInstance == nil {
		controllerInstance = &RoomController{
			roomMgr: rtc.GetRoomManagerInstance(),
		}
	}
	singletonMutex.Unlock()
	return controllerInstance
}
