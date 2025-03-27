package handlers

import (
	"net/http"
	"strings"
)

func getPathTokens(req *http.Request) []string {
	// Split the URL path into tokens
	path := req.URL.Path
	tokens := strings.Split(strings.Trim(path, "/"), "/")
	return tokens
}
