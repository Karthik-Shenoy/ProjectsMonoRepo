package api

import (
	"crypto/sha256"
	ClientManager "database-profiler/api/ClientManager"
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

	clientMgr := ClientManager.GetClientManagerInstance()
	client, found := clientMgr.GetClient(queryMessage.ClientId)

	if !found {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	udpClient.SendRequest(payload, correlationId, uint16(client.DBPort))

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

func RegisterClientHandler(w http.ResponseWriter, req *http.Request) {

	// decode json body
	decoder := json.NewDecoder(req.Body)
	var registrationMessage interop.ClientHeartBeat = interop.ClientHeartBeat{}
	err := decoder.Decode(&registrationMessage)

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// generate a token, sign it with the server's private key, and send it to the client
	ClientManager.GetClientManagerInstance().AddClient(registrationMessage.ClientId)

	jwtPayload := ClientManager.JWTPayload{
		ClientId:  registrationMessage.ClientId,
		CreatedAt: time.Now().Unix(),
	}

	serializedJson, err := json.Marshal(jwtPayload)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// generate token
	hashedSignature := sha256.Sum256(serializedJson)

	// base 64 encode the token
	base64Signature := base64.StdEncoding.EncodeToString(hashedSignature[:])

	// send the token to the client, in cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "payload",
		Value:    base64.StdEncoding.EncodeToString(serializedJson),
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
		Path:     "/",
		MaxAge:   3600,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "signature",
		Value:    base64Signature,
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
		Path:     "/",
		MaxAge:   3600,
	})

	w.WriteHeader(http.StatusOK)

}

func HeartBeatHandler(w http.ResponseWriter, req *http.Request) {

}
