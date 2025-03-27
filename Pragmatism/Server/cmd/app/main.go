package main

import (
	"fmt"
	"net/http"
	"pragmatism/internal/auth"
	handlers "pragmatism/internal/handlers/http"
	"pragmatism/internal/middlewares"
)

func main() {
	http.HandleFunc("/", middlewares.CorsHandler)
	auth.InitOAuthHandlers()
	handlers.InitTaskHandlers()

	fmt.Println("Server listening on http://127.0.0.1:3000")
	http.ListenAndServe(":3000", nil)
}
