package api

import (
	"net/http"
)

// HOF returns a wrapped handler
func CorsMiddleWare(handler http.HandlerFunc, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

		if req.Method == http.MethodOptions {
			w.WriteHeader(200)
			return
		}

		if req.Method == method {
			handler(w, req)
		}

	}
}
