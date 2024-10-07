package main

import (
	"database-profiler/api"
	"database-profiler/udp"
	"fmt"
	"net/http"
)

func main() {

	http.Handle("/query", api.CorsMiddleWare(api.HandleQuery, http.MethodPost))

	udpClient := udp.GetUdpClientInstance()
	udpClient.StartListening()

	fmt.Println("server running at 127.0.0.1:3000")
	http.ListenAndServe("127.0.0.1:3000", nil)
}
