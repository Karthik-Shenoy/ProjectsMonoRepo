package main

import (
	"flag"
	"fmt"
	"net/http"
	"pragmatism/internal/auth"
	"pragmatism/internal/cmdflags"
	handlers "pragmatism/internal/handlers/http"

	"pragmatism/internal/middlewares"

	// to register all the services
	_ "pragmatism/internal/services/serviceinjector"
)

func main() {
	flag.BoolVar(&cmdflags.DevMode, "dev", false, "Run in development mode")

	http.HandleFunc("/", middlewares.CorsHandler)
	auth.InitAuthHandlers()
	auth.InitOAuthHandlers()
	handlers.InitTaskHandlers()
	handlers.InitUserDataHandlers()

	fmt.Println("Server listening on http://127.0.0.1:3000")
	err := http.ListenAndServe(":3000", nil)

	if err != nil {
		fmt.Println("Failed to start the server due to error: ", err)
	}
}
