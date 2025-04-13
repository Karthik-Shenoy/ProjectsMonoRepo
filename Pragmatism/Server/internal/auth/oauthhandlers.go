package auth

import (
	"fmt"
	"net/http"
	"os"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/auth/auth_helpers"
	"pragmatism/internal/helpers"
	"pragmatism/internal/middlewares"
	users_model "pragmatism/internal/models/usersmodel"
	"pragmatism/internal/services/serviceinjector"
	"pragmatism/internal/services/telemetryservice"
	"strings"
)

func InitOAuthHandlers() {
	http.HandleFunc("GET /auth/callback", middlewares.CorsMiddleware(oauthHandler, http.MethodGet))
}

func getServiceErrorOrigin(funcName string) string {
	return "Auth." + funcName
}

func oauthHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "text/html; charset=utf-8")

	OAuthCode := req.URL.Query().Get("code")
	fmt.Println(OAuthCode)

	popUpHtmlTemplate, err := os.ReadFile(GetOauthCallbackTemplatePath())

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	userModelService, appErr := serviceinjector.GetService[users_model.UsersModelService]()
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write(payload)
		return
	}

	var authStrategy auth_helpers.AuthenticatorStrategy = auth_helpers.NewOauthTokenAuthenticatorStrategy(
		OAuthCode,
		http.Client{},
		userModelService,
	)

	authSuccessful, appErr := authStrategy.Authenticate()

	if appErr != nil || !authSuccessful {
		if appErr != nil {
			telemetryservice.GetInstance().LogError(appErr)
		}
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	authToken, appErr := authStrategy.GenerateAuthToken()

	if appErr != nil {
		w.WriteHeader(http.StatusUnauthorized)
		telemetryservice.GetInstance().LogError(appErr)
		return
	}

	userId, err := GetUserIdFromPayload(authToken.Payload)

	if err != nil {
		appErr := apperrors.NewAppError(
			apperrors.AuthHandlers_NonRetryable_FailedToGetUserIdFromTokenPayload,
			getServiceErrorOrigin("oauthHandler"),
			fmt.Sprintf("tokenPayload=%s, err =%s", authToken.Payload, err.Error()),
		)
		telemetryservice.GetInstance().LogError(appErr)
		w.Write([]byte(popUpHtmlTemplate))
		return
	}

	user, appErr := userModelService.GetUser(userId)

	if appErr != nil {
		wrappedAppErr := apperrors.NewAppErrorFromLowerLayerError(
			apperrors.AuthHandlers_NonRetryable_FailedToGetUserDataCorrespondingToTheId,
			getServiceErrorOrigin("oauthHandler"),
			"Failed to get user data",
			appErr,
		)
		telemetryservice.GetInstance().LogError(wrappedAppErr)
		w.Write([]byte(popUpHtmlTemplate))
		return
	}

	updatedPopUpHtmlTemplate := strings.Replace(string(popUpHtmlTemplate), "{{Payload}}", authToken.Payload, -1)
	updatedPopUpHtmlTemplate = strings.Replace(string(updatedPopUpHtmlTemplate), "{{Signature}}", authToken.Signature, -1)
	updatedPopUpHtmlTemplate = strings.Replace(string(updatedPopUpHtmlTemplate), "{{UserName}}", user.Name, -1)
	updatedPopUpHtmlTemplate = strings.Replace(string(updatedPopUpHtmlTemplate), "{{PictureUrl}}", user.PictureUri, -1)
	updatedPopUpHtmlTemplate = strings.Replace(string(updatedPopUpHtmlTemplate), "{{UserId}}", userId, -1)

	w.Write([]byte(updatedPopUpHtmlTemplate))
}
