package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"pragmatism/internal/middlewares"
	"strings"
)

func InitOAuthHandlers() {
	http.HandleFunc("/auth/callback", middlewares.CorsMiddleware(oauthHandler, http.MethodGet))
}

func oauthHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "text/html; charset=utf-8")

	OAuthCode := req.URL.Query().Get("code")
	fmt.Println(OAuthCode)

	popUpHtmlTemplate, err := os.ReadFile("./public/templates/oauth-redirect-page.html")

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	tokens, err := ExchangeCodeForTokens(OAuthCode)

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	newRequest, err := http.NewRequest(http.MethodGet, "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	newRequest.Header.Add("Authorization", fmt.Sprintf("Bearer %s", tokens.AccessToken))

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(newRequest)
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}
	var unMarshalledBody struct {
		Name string `json:"name"`
	}

	json.Unmarshal(body, &unMarshalledBody)

	authToken := GenerateAuthToken(unMarshalledBody.Name)

	updatedPopUpHtmlTemplate := strings.Replace(string(popUpHtmlTemplate), "{{Payload}}", authToken.Payload, -1)
	updatedPopUpHtmlTemplate = strings.Replace(string(updatedPopUpHtmlTemplate), "{{Signature}}", authToken.Signature, -1)
	updatedPopUpHtmlTemplate = strings.Replace(string(updatedPopUpHtmlTemplate), "{{UserName}}", unMarshalledBody.Name, -1)

	w.Write([]byte(updatedPopUpHtmlTemplate))
}
