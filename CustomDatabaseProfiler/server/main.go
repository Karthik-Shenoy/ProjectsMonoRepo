package main

import (
	"database-profiler/api"
	"database-profiler/udp"
	"fmt"
	"net/http"
)

func main() {

	http.Handle("/query", api.ChainCorsAndAuthMiddleWare(api.HandleQuery, http.MethodPost))
	http.Handle("/register", api.CorsMiddleWare(api.RegisterClientHandler, http.MethodPost))

	udpClient := udp.GetUdpClientInstance()
	udpClient.StartListening()

	fmt.Println("server running at 127.0.0.1:3000")
	http.ListenAndServe("127.0.0.1:3000", nil)
}
