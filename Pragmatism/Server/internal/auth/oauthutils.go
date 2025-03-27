package auth

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"pragmatism/api"
)

type TokensResponse struct {
	AccessToken string `json:"access_token"`
	IDToken     string `json:"id_token"`
	// space separated scopes for the given token
	Scope        string `json:"scope"`
	RefreshToken string `json:"refresh_token"`
}

func ExchangeCodeForTokens(code string) (*TokensResponse, error) {
	// Google OAuth token endpoint
	url := "https://oauth2.googleapis.com/token"

	// Prepare request payload
	data := map[string]string{
		"code":          code,
		"client_id":     os.Getenv(ENV_VARIABLE_GOOGLE_CLIENT_ID),
		"client_secret": os.Getenv(ENV_VARIABLE_GOOGLE_CLIENT_SECRET),
		"redirect_uri":  "https://www.pragmatism.shenoyk.com/api/auth/callback",
		"grant_type":    "authorization_code",
	}
	payload, _ := json.Marshal(data)

	// Make POST request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Parse response
	var token TokensResponse
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return nil, err
	}
	if token.AccessToken == "" {
		return nil, errors.New("failed to get access token")
	}

	return &token, nil
}

func GenerateAuthToken(userName string) api.AuthToken {

	randomSecret := rand.Int63()

	payload := userName + ":" + fmt.Sprint(randomSecret)

	key := os.Getenv(ENV_VARIABLE_SHA_SECRET)

	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(payload))
	signature := mac.Sum(nil)

	return api.AuthToken{
		Signature: hex.EncodeToString(signature),
		Payload:   hex.EncodeToString([]byte(payload)),
	}
}

func ValidateAuthToken(token api.AuthToken) bool {
	key := os.Getenv(ENV_VARIABLE_SHA_SECRET)

	decodedSignature, err := hex.DecodeString(token.Signature)

	if err != nil {
		return false
	}

	payload, err := hex.DecodeString(token.Payload)

	if err != nil {
		return false
	}

	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(payload))
	expectedMAC := mac.Sum(nil)

	return hmac.Equal(expectedMAC, decodedSignature)
}
