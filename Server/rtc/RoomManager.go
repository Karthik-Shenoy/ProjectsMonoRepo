package rtc

import (
	"errors"
	"word-roulette/game"

	"github.com/gorilla/websocket"
)

type RoomUsersMap = map[string][]*Client

type RoomManager struct {
	roomUsersMap RoomUsersMap
}

func (mgr *RoomManager) AddUser(roomId string, player *game.Player) error {
	usersList, ok := mgr.roomUsersMap[roomId]
	if !ok {
		return errors.New("room does not exist")
	}
	for _, playerIter := range usersList {
		if player.GetName() == playerIter.GetName() {
			return errors.New("username already exists")
		}
	}
	mgr.roomUsersMap[roomId] = append(usersList, NewClient(player, roomId))

	return nil
}

func (mgr *RoomManager) CreateRoom(roomId string) error {
	_, ok := mgr.roomUsersMap[roomId]
	if ok {
		return errors.New("room already exists")
	}
	mgr.roomUsersMap[roomId] = make([]*Client, 0)
	return nil
}

func (mgr *RoomManager) GetUser(roomId string, username string) (*Client, error) {
	userList, ok := mgr.roomUsersMap[roomId]
	if !ok {
		return nil, errors.New("RTCManager.GetUser: room does not exist")
	}
	for _, user := range userList {
		if user.GetName() == username {
			return user, nil
		}
	}

	return nil, errors.New("RTCManager.GetUser: user does not exist")
}

func (mgr *RoomManager) GetUsersInRoom(roomId string) ([]*Client, error) {
	userList, ok := mgr.roomUsersMap[roomId]
	if !ok {
		return nil, errors.New("RTCManager.GetUsersInRoom: room does not exist")
	}
	return userList, nil
}

func (mgr *RoomManager) MapConnection(roomId, username string, conn *websocket.Conn) error {
	userList, ok := mgr.roomUsersMap[roomId]
	if !ok {
		return errors.New("RTCManager.MapConnection: room does not exist")
	}
	for index, user := range userList {
		if user.GetName() == username {
			userList[index].SetClientRtcConn(conn)
			return nil
		}
	}

	return errors.New("RTCManager.MapConnection: user does not exist")
}

var roomManagerSingletonInstance *RoomManager = nil

func GetRoomManagerInstance() *RoomManager {
	if roomManagerSingletonInstance == nil {
		roomManagerSingletonInstance = &RoomManager{
			roomUsersMap: make(map[string][]*Client),
		}
	}
	return roomManagerSingletonInstance
}
