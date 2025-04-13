package auth

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"pragmatism/api"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/auth/auth_helpers"
	"pragmatism/internal/helpers"
	"pragmatism/internal/middlewares"
	users_model "pragmatism/internal/models/usersmodel"
	"pragmatism/internal/services/serviceinjector"
	"pragmatism/internal/services/telemetryservice"
	"strings"
)

func InitAuthHandlers() {
	http.HandleFunc("GET /auth", middlewares.CorsMiddleware(AuthHandler, http.MethodGet))
	http.HandleFunc("POST /auth", middlewares.CorsMiddleware(AuthTokenCookieGetHandler, http.MethodPost))
}

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	cookies := r.Cookies()
	var token api.AuthToken
	for _, cookie := range cookies {
		if cookie.Name == "token" {
			// decode hex
			decodedValue, err := hex.DecodeString(cookie.Value)
			if err != nil {
				telemetryservice.GetInstance().LogError(apperrors.NewAppError(
					apperrors.AuthHandlers_NonRetryable_FailedToDecodeHexTokenValue,
					getServiceErrorOrigin("AuthHandler"),
					err.Error(),
				))
				w.WriteHeader(http.StatusUnauthorized)
			}
			json.Unmarshal([]byte(decodedValue), &token)
		}
	}
	if token.Payload == "" || token.Signature == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if !auth_helpers.AuthenticateFromToken(&token) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userId, err := GetUserIdFromPayload(token.Payload)
	if err != nil {
		appErr := apperrors.NewAppError(
			apperrors.AuthHandlers_NonRetryable_FailedToGetUserIdFromTokenPayload,
			getServiceErrorOrigin("AuthHandler"),
			err.Error(),
		)
		telemetryservice.GetInstance().LogError(appErr)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userModelService, appErr := serviceinjector.GetService[users_model.UsersModelService]()
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write(payload)
		return
	}

	user, appErr := userModelService.GetUser(userId)
	if appErr != nil {
		wrappedAppErr := apperrors.NewAppErrorFromLowerLayerError(
			apperrors.AuthHandlers_NonRetryable_FailedToGetUserDataCorrespondingToTheId,
			getServiceErrorOrigin("AuthHandler"),
			"Failed to get user data",
			appErr,
		)
		telemetryservice.GetInstance().LogError(wrappedAppErr)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	payload, err := json.Marshal(user)
	if err != nil {
		telemetryservice.GetInstance().LogError(apperrors.NewAppError(
			apperrors.AuthHandlers_NonRetryable_FailedToMarshallUserData,
			getServiceErrorOrigin("AuthHandler"),
			err.Error(),
		))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)
}

// This handler is used to set the auth token in the cookie
// It is used when the user is authenticated using the oauth flow
// its hacky, post oauth success the client gets auth token and sends
// a post request to this endpoint, which in turn sets the cookie
func AuthTokenCookieGetHandler(w http.ResponseWriter, req *http.Request) {
	var authToken api.AuthToken
	json.NewDecoder(req.Body).Decode(&authToken)

	if authToken.Payload == "" || authToken.Signature == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if !auth_helpers.AuthenticateFromToken(&authToken) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	token, err := json.Marshal(authToken)
	if err != nil {
		telemetryservice.GetInstance().LogError(apperrors.NewAppError(
			apperrors.AuthHandlers_NonRetryable_FailedToMarshallAuthToken,
			getServiceErrorOrigin("AuthTokenCookieGetHandler"),
			err.Error(),
		))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// base64 encode the token to avoid bad characters in the cookie
	encodedToken := hex.EncodeToString([]byte(token))

	authCookie := http.Cookie{
		Name:     "token",
		Value:    string(encodedToken),
		MaxAge:   3600, // 1 hour
		SameSite: GetAuthCookieSameSiteMode(),
		Secure:   true,
		Path:     "/",
	}
	w.Header().Set("Set-Cookie", authCookie.String())
	w.WriteHeader(http.StatusOK)
}

func AuthMiddleWare(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		cookies := req.Cookies()
		var token api.AuthToken

		for _, cookie := range cookies {
			if cookie.Name == "token" {
				decodedValue, err := hex.DecodeString(cookie.Value)
				if err != nil {
					telemetryservice.GetInstance().LogError(apperrors.NewAppError(
						apperrors.AuthHandlers_NonRetryable_FailedToDecodeHexTokenValue,
						getServiceErrorOrigin("AuthHandler"),
						err.Error(),
					))
					w.WriteHeader(http.StatusUnauthorized)
				}
				json.Unmarshal([]byte(decodedValue), &token)
			}
		}

		userId, err := GetUserIdFromPayload(token.Payload)

		if err != nil {
			// ad appropriate logging here
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// Add userId to the request context
		ctx := context.WithValue(req.Context(), "userId", userId)
		req = req.WithContext(ctx)

		if token.Payload == "" || token.Signature == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if !auth_helpers.AuthenticateFromToken(&token) {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		handlerFunc(w, req)
	}
}

func GetUserIdFromPayload(payload string) (string, error) {
	// decode hex
	decodedPayload, err := hex.DecodeString(payload)

	if err != nil {
		return "", err
	}

	splitPayload := strings.Split(string(decodedPayload), ":")
	if len(splitPayload) != 2 {
		return "", fmt.Errorf("token.payload is not in the right format")
	}
	return splitPayload[0], nil
}
