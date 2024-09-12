package rtc

import (
	"encoding/json"
	"fmt"
	"net/http"
	"word-roulette/interop"
	rtcUtils "word-roulette/rtc/rtcutils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type MappingResult struct {
	Client *Client
	Err    error
}

type ClientMappedNotifier = chan MappingResult

type ConnectionsList = []*websocket.Conn

type RTCManager struct {
	connectionsList ConnectionsList
	roomMgr         RoomManager
}

func (rtcMgr *RTCManager) UpgradeConnectionHandler(w http.ResponseWriter, req *http.Request) {
	conn, err := upgrader.Upgrade(w, req, nil)

	if err != nil {
		fmt.Println("http connection upgrade failed!", err)
		return
	}

	rtcMgr.connectionsList = append(rtcMgr.connectionsList, conn)

	notifier := make(ClientMappedNotifier)
	go rtcMgr.connectionMappingHandler(conn, &notifier)

	mappingResult := <-notifier
	if mappingResult.Err != nil {
		return
	}
	go mappingResult.Client.HandleConnection()
}

// leverages the init message sent by the client to map to the right object in the room manager
func (rtcMgr *RTCManager) connectionMappingHandler(conn *websocket.Conn, notifier *ClientMappedNotifier) {
	// init event
	for {
		wsMsgType, payload, err := conn.ReadMessage()

		if err != nil {
			conn.Close()
			fmt.Println("rtc.RTCManager.connectionMappingHandler: closing client connection from the server")
			*notifier <- MappingResult{
				Client: nil,
				Err:    err,
			}
			return
		}

		if wsMsgType == websocket.CloseMessage {
			fmt.Println("rtc.RTCManager.connectionMappingHandler: connection closed without init message")
			return
		}

		if wsMsgType != websocket.TextMessage {
			continue
		}

		msgDiscriminator, err := rtcUtils.ReadMessageDiscriminator(payload)

		if err != nil {
			fmt.Println(err)
			conn.Close()
			*notifier <- MappingResult{
				Client: nil,
				Err:    err,
			}
			return
		}

		if msgDiscriminator.MessageType != interop.MESSAGE_TYPE_INIT {
			fmt.Println("RTCManager.ConnectionMappingHandler: Init message was not sent initially")
			conn.Close()
			*notifier <- MappingResult{
				Client: nil,
				Err:    fmt.Errorf("init message was not sent initially"),
			}
			return
		}

		initMsg := interop.RTCMessageInit{}

		err = json.Unmarshal(payload, &initMsg)

		if err != nil {
			fmt.Println("RTCManager.ConnectionMappingHandler: Some issue ocurred when un-marshalling the init message")
			conn.Close()
			*notifier <- MappingResult{
				Client: nil,
				Err:    err,
			}
			return
		}

		// map connection
		err = rtcMgr.roomMgr.MapConnection(initMsg.RoomId, initMsg.UserName, conn)

		if err != nil {
			fmt.Println("RTCManager.ConnectionMappingHandler: ", err)
			conn.Close()
			*notifier <- MappingResult{
				Client: nil,
				Err:    err,
			}
			return
		}

		client, err := rtcMgr.roomMgr.GetUser(initMsg.RoomId, initMsg.UserName)

		// broadcast init message to let others update the room user list
		rtcMgr.BroadcastInRoom(client, client.roomId, payload, false)

		if err != nil {
			fmt.Println("RTCManager.ConnectionMappingHandler: ", err)
			conn.Close()
			*notifier <- MappingResult{
				Client: nil,
				Err:    err,
			}
			return
		}

		// notify the caller
		*notifier <- MappingResult{
			Client: client,
			Err:    nil,
		}
		return
	}
}

func (rtcMgr RTCManager) BroadcastInRoom(client *Client, roomId string, payload []byte, shouldSendToSelf bool) error {
	usersList, err := rtcMgr.roomMgr.GetUsersInRoom(roomId)

	if err != nil {
		return fmt.Errorf("RTCManager.broadcastInRoom : %s", err)
	}

	for _, currClient := range usersList {
		if !shouldSendToSelf && currClient.player.GetName() == client.GetName() {
			continue
		}
		currClient.connection.WriteMessage(websocket.TextMessage, payload)
	}
	return nil
}

func (rtcMgr RTCManager) GetUsersPositionMap(roomId string) map[string]int {
	usersList, err := rtcMgr.roomMgr.GetUsersInRoom(roomId)

	if err != nil {
		fmt.Println("RTCManager.GetUsersPositionMap: ", err)
		return nil
	}

	positionMap := make(map[string]int)

	for index, user := range usersList {
		positionMap[user.GetName()] = index
	}

	return positionMap
}

// send error message to client
func SendErrorToClient() {

}

var rtcManagerSingletonInstance *RTCManager = nil

func GetRTCManagerInstance() *RTCManager {
	if rtcManagerSingletonInstance == nil {
		rtcManagerSingletonInstance = &RTCManager{
			connectionsList: make(ConnectionsList, 0),
			roomMgr:         *GetRoomManagerInstance(),
		}
	}
	return rtcManagerSingletonInstance
}
