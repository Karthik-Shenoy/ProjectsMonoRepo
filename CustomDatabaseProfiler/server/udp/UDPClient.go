package udp

import (
	"database-profiler/interop"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net"
)

const CLIENT_PORT uint16 = 57777
const DB_PORT uint16 = 8080

// Handles UDP messages (buffer) do not modify the buffer (as it may cause side-effects in other handlers)
type UDPMessageHandler = func([]byte)

type UDPClient struct {
	udpConn         net.PacketConn
	messageHandlers map[uint32]UDPMessageHandler
}

func (client *UDPClient) CloseConn() {
	client.udpConn.Close()
}

func (client *UDPClient) StartListening() {
	go func() {
		fmt.Println("Started UDP client")
		for {
			buf := make([]byte, 1024)
			bytesRead, _, err := client.udpConn.ReadFrom(buf)

			if err != nil {
				fmt.Println("Error when reading from the socket: ", err)
				continue
			}

			for _, messageHandler := range client.messageHandlers {
				messageHandler(buf[:bytesRead])
			}
		}
	}()
}

func (client *UDPClient) SendRequest(buf []byte, correlationId uint32) {
	udpMessage := interop.UdpMessage{
		CorrelationId: correlationId,
		Payload:       base64.StdEncoding.EncodeToString(buf),
	}

	payload, err := json.Marshal(udpMessage)

	if err != nil {
		fmt.Println("udp.UDPClient.SendPacket some error ocurred when marshalling json")
		return
	}

	client.udpConn.WriteTo(payload, &net.UDPAddr{
		IP:   net.ParseIP("127.0.0.1"),
		Port: int(DB_PORT),
	})
}

func (client *UDPClient) AddMessageHandler(correlationId uint32, handler UDPMessageHandler) {
	client.messageHandlers[correlationId] = handler
}

func (client *UDPClient) RemoveHandler(correlationId uint32) {
	_, ok := client.messageHandlers[correlationId]

	if !ok {
		return
	}

	delete(client.messageHandlers, correlationId)
}

var singletonClientInstance *UDPClient = nil

func GetUdpClientInstance() *UDPClient {
	if singletonClientInstance == nil {
		conn, err := net.ListenPacket("udp", fmt.Sprintf(":%d", CLIENT_PORT))

		if err != nil {
			panic(err)
		}

		singletonClientInstance = &UDPClient{
			udpConn:         conn,
			messageHandlers: make(map[uint32]UDPMessageHandler, 0),
		}

	}
	return singletonClientInstance
}
