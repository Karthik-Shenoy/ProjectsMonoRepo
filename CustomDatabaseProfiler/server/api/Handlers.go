package api

import (
	"database-profiler/interop"
	"database-profiler/udp"
	"database-profiler/utils"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleQuery(w http.ResponseWriter, req *http.Request) {
	queryMessage := interop.QueryMessage{}

	decoder := json.NewDecoder(req.Body)

	err := decoder.Decode(&queryMessage)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	correlationId := uint32(time.Now().UnixNano() % int64(0xFFFFFFFF))

	udpClient := udp.GetUdpClientInstance()
	payload := []byte(queryMessage.Query)
	udpClient.SendRequest(payload, correlationId)

	udpResponseAwaiter := make(chan []byte)

	udpClient.AddMessageHandler(correlationId, func(buf []byte) {
		udpMessage := interop.UdpMessage{}
		err := json.Unmarshal(buf, &udpMessage)
		if err != nil {
			panic(err.Error() + "data:" + string(buf))
		}

		if udpMessage.CorrelationId == correlationId {
			decodedDatabaseResponsePayload := make([]byte, 1024)

			normalizedPayload := utils.RemoveBase64padding(udpMessage.Payload)

			bytesWritten, err := base64.RawStdEncoding.Decode(decodedDatabaseResponsePayload, []byte(normalizedPayload))

			if err != nil {
				fmt.Println([]byte(udpMessage.Payload))
				panic(err.Error() + "data:" + string(udpMessage.Payload))
			}

			udpResponseAwaiter <- decodedDatabaseResponsePayload[:bytesWritten]
			udpClient.RemoveHandler(correlationId)
		}
	})
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(<-udpResponseAwaiter)
}
