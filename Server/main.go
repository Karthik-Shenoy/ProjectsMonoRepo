package main

import (
	"flag"
	"fmt"
	"net/http"
	"word-roulette/api"
	"word-roulette/log_utils"
	"word-roulette/rtc"
)

func init() {
	var DEBUG bool
	flag.BoolVar(&DEBUG, "debug", false, "Enable debug mode")
	log_utils.SetDebug(DEBUG)
}

func main() {
	rtcManager := rtc.GetRTCManagerInstance()
	http.HandleFunc("/create-room", CorsHandlerMiddleWare(api.HandleRoomCreate, http.MethodPost))
	http.HandleFunc("/join-room", CorsHandlerMiddleWare(api.HandleRoomJoin, http.MethodPost))
	http.HandleFunc("/isWordValid", CorsHandlerMiddleWare(api.HandleIsValidRequest, http.MethodPost))
	http.HandleFunc("/rtc", CorsHandlerMiddleWare(rtcManager.UpgradeConnectionHandler, http.MethodGet))

	fmt.Println("Server running at http://127.0.0.1:3001")
	http.ListenAndServe(":3001", nil)
}

func CorsHandlerMiddleWare(handler http.HandlerFunc, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add(
			"Access-Control-Allow-Headers",
			"Content-Type, Keep-Alive, Origin, Content-Type, Accept, Authorization")
		w.Header().Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if req.Method == http.MethodOptions {
			w.WriteHeader(200)
			return
		} else if req.Method == method {
			handler(w, req)
		}
	}

}
