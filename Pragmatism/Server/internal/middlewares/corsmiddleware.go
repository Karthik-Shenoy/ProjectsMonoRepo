package middlewares

import "net/http"

func appendAccessControlHeaders(w http.ResponseWriter) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
}

func CorsMiddleware(next http.HandlerFunc, allowedMethod string) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		if req.Method == http.MethodOptions {
			appendAccessControlHeaders(w)
			w.Header().Add("Cache-Control", "max-age=604800")
			w.WriteHeader(200)
			return
		}

		if req.Method != allowedMethod {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		appendAccessControlHeaders(w)

		next(w, req)
	}
}

func CorsHandler(w http.ResponseWriter, req *http.Request) {
	appendAccessControlHeaders(w)
	w.Header().Add("Cache-Control", "max-age=604800")
	w.WriteHeader(200)
}
