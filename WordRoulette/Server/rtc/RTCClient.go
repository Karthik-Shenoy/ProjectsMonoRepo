package rtc

import (
	"encoding/json"
	"fmt"
	"word-roulette/game"
	"word-roulette/interop"
	rtcUtils "word-roulette/rtc/rtcutils"

	"github.com/gorilla/websocket"
)

type Client struct {
	player     *game.Player
	roomId     string
	connection *websocket.Conn
}

func (client *Client) SetClientRtcConn(conn *websocket.Conn) {
	client.connection = conn
}

func (client *Client) GetName() string {
	return client.player.GetName()
}

// player initializes itself, sends word and death updates
func (client *Client) HandleConnection() {
	for {
		// start game
		wsMessageType, payload, err := client.connection.ReadMessage()

		if err != nil {
			fmt.Printf("rtc.Client.HandleConnection: closing the client connection from server, in response to abrupt client closure")
			client.connection.Close()
			return
		}

		if wsMessageType == websocket.CloseMessage {
			fmt.Printf("rtc.Client.HandleConnection: connection closed by the client")
			return
		}

		if wsMessageType != websocket.TextMessage {
			continue
		}

		msgDiscriminator, err := rtcUtils.ReadMessageDiscriminator(payload)

		if err != nil {
			fmt.Println(err)
			return
		}
		var rtcManager *RTCManager = GetRTCManagerInstance()
		switch msgDiscriminator.MessageType {
		case interop.MESSAGE_TYPE_GAME_START:
			{
				// Game start
				var gameStartBroadCastMessage = interop.RTCGameStartBroadcastMessage{
					MessageType: interop.MESSAGE_TYPE_GAME_START_BROADCAST,
					PositionMap: rtcManager.GetUsersPositionMap(client.roomId),
				}
				payload, err := json.Marshal(gameStartBroadCastMessage)

				if err != nil {
					fmt.Println("RTCClient.HandleConnection: ", err)
					return
				}

				rtcManager.BroadcastInRoom(client, client.roomId, payload, true)
				break
			}
		case interop.MESSAGE_TYPE_WORD:
			{
				// word update
				rtcManager.BroadcastInRoom(client, client.roomId, payload, false)
				break
			}
		case interop.MESSAGE_TYPE_DEATH:
			{
				// death update
				rtcManager.BroadcastInRoom(client, client.roomId, payload, false)
				break
			}
		}

	}
}

func NewClient(player *game.Player, roomId string) *Client {
	return &Client{
		player:     player,
		roomId:     roomId,
		connection: nil,
	}
}
