package api

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"

	"database-profiler/config"
)

type JWT struct {
	payload   string
	signature string
}

// HOF returns a wrapped handler
func CorsMiddleWare(handler http.HandlerFunc, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", config.CORS_ALLOWED_ORIGIN)
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type,Cookie")
		w.Header().Add("Access-Control-Allow-Credentials", "true")

		if req.Method == http.MethodOptions {
			w.WriteHeader(200)
			return
		}

		if req.Method == method {
			handler(w, req)
		}

	}
}

func AuthMiddleWare(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Check for authentication
		cookies, isPresent := req.Header["Cookie"]

		if !isPresent {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token, err := getTokenFromCookies(cookies)

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		decodedPayload, err := base64.StdEncoding.DecodeString(token.payload)

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		decodedSignature, err := base64.StdEncoding.DecodeString(token.signature)

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		hashedPayload := sha256.Sum256(decodedPayload)
		hashedPayloadSlice := hashedPayload[:]

		if string(hashedPayloadSlice) != string(decodedSignature) {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		//authenticated
		handler(w, req)

	}
}

func ChainCorsAndAuthMiddleWare(handler http.HandlerFunc, method string) http.HandlerFunc {
	return CorsMiddleWare(AuthMiddleWare(handler), method)
}

func getTokenFromCookies(cookies []string) (*JWT, error) {

	if len(cookies) < 1 {
		return nil, fmt.Errorf("invalid Cookie")
	}

	token := JWT{}
	cntProps := 0

	for _, cookie := range strings.Split(cookies[0], ";") {
		splitCookie := strings.Split(cookie, "=")
		if len(splitCookie) < 2 {
			continue
		} else if len(splitCookie) >= 3 {
			for i := 2; i < len(splitCookie); i++ {
				splitCookie[1] += "=" + splitCookie[i]
			}
		}

		switch normalizeSpaces(splitCookie[0]) {
		case "payload":
			{
				token.payload = splitCookie[1]
				cntProps++
				break
			}
		case "signature":
			{
				token.signature = splitCookie[1]
				cntProps++
				break
			}
		}
	}

	if cntProps != 2 {
		return nil, fmt.Errorf("invalid token")
	}

	return &token, nil
}

func normalizeSpaces(str string) string {
	start := 0
	end := len(str)
	for start < len(str) && str[start] == ' ' {
		start++
	}
	for end > 1 && str[end-1] == ' ' {
		end--
	}
	return str[start:end]
}
