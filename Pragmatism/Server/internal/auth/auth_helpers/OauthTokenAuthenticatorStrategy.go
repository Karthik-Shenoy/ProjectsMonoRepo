package auth_helpers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"pragmatism/api"
	"pragmatism/internal/apperrors"
	users_model "pragmatism/internal/models/usersmodel"
)

type OauthTokenAuthenticatorStrategyContext struct {
	authCode string
	userId   *string
}

// create a new instance of this struct to invoke a new oauth flow
type OauthTokenAuthenticatorStrategy struct {
	// Immutable context (set using constructor injection, or internal setting)
	oauthContext OauthTokenAuthenticatorStrategyContext
	httpClient   http.Client
	usersModel   *users_model.UsersModelService
}

func getServiceErrorOrigin(funcName string) string {
	return "OauthTokenStrategy." + funcName
}

func NewOauthTokenAuthenticatorStrategy(authCode string, httpClient http.Client, usersModel *users_model.UsersModelService) *OauthTokenAuthenticatorStrategy {
	return &OauthTokenAuthenticatorStrategy{
		oauthContext: OauthTokenAuthenticatorStrategyContext{
			authCode,
			nil,
		},
		httpClient: httpClient,
		usersModel: usersModel,
	}

}

func (authStrategy *OauthTokenAuthenticatorStrategy) Authenticate() (bool, *apperrors.AppError) {
	// check if user already exists or else sign them up
	user, err := authStrategy.createNewOrGetUser()
	if err != nil {
		wrappedErr := apperrors.NewAppErrorFromLowerLayerError(
			apperrors.AuthHelpers_NonRetryable_FailedToAuthenticateUser,
			getServiceErrorOrigin("Authenticate"),
			err.Message,
			err,
		)
		return false, wrappedErr
	}
	authStrategy.oauthContext.userId = &user.Id

	return true, nil
}

func (authStrategy *OauthTokenAuthenticatorStrategy) GenerateAuthToken() (*api.AuthToken, *apperrors.AppError) {
	randomSecret := rand.Int63()

	if authStrategy.oauthContext.userId == nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToGetUserInfo,
			getServiceErrorOrigin("GenerateAuthToken"),
			"userId is a nil pointer",
		)
	}

	payload := *authStrategy.oauthContext.userId + ":" + fmt.Sprint(randomSecret)

	key := os.Getenv(ENV_VARIABLE_SHA_SECRET)

	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(payload))
	signature := mac.Sum(nil)

	return &api.AuthToken{
		Signature: hex.EncodeToString(signature),
		Payload:   hex.EncodeToString([]byte(payload)),
	}, nil
}

func (authStrategy *OauthTokenAuthenticatorStrategy) createNewOrGetUser() (*users_model.User, *apperrors.AppError) {
	oauthServerTokens, err := authStrategy.exchangeAuthCodeForAccessToken()

	if err != nil {
		return nil, err
	}

	user, err := authStrategy.getUserInfo(oauthServerTokens.AccessToken)
	if err != nil {
		return nil, err
	}

	doesUserExist, err := authStrategy.usersModel.DoesUserExist(user.Id)

	if err != nil {
		return nil, err
	}

	if doesUserExist {
		user, err := authStrategy.usersModel.GetUser(user.Id)
		return user, err
	}

	err = authStrategy.usersModel.CreateUser(user)
	if err != nil {
		return nil, apperrors.NewAppErrorFromLowerLayerError(
			apperrors.AuthHelpers_NonRetryable_FailedToCreateNewUser,
			getServiceErrorOrigin("createNewUser"),
			err.Message,
			err,
		)
	}

	return user, nil
}

func (authStrategy *OauthTokenAuthenticatorStrategy) getUserInfo(accessToken string) (*users_model.User, *apperrors.AppError) {
	newRequest, err := http.NewRequest(http.MethodGet, GOOGLE_USER_INFO_END_POINT_URL, nil)
	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToBuildUserInfoRequest,
			getServiceErrorOrigin("getUserInfo"),
			err.Error(),
		)
	}
	newRequest.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	response, err := authStrategy.httpClient.Do(newRequest)

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToGetUserInfo,
			getServiceErrorOrigin("getUserInfo"),
			err.Error(),
		)
	}

	// Read response body
	body, err := io.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToGetUserInfo,
			getServiceErrorOrigin("getUserInfo"),
			"Failed To Read UserInfo Body: "+err.Error(),
		)
	}
	var unMarshalledBody = users_model.User{}
	err = json.Unmarshal(body, &unMarshalledBody)
	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToParseUserInfoResponse,
			getServiceErrorOrigin("getUserInfo"),
			err.Error(),
		)
	}
	return &unMarshalledBody, nil
}

func (authStrategy *OauthTokenAuthenticatorStrategy) exchangeAuthCodeForAccessToken() (*OAuthServerTokensResponse, *apperrors.AppError) {

	// Prepare request payload
	data := map[string]string{
		"code":          authStrategy.oauthContext.authCode,
		"client_id":     os.Getenv(ENV_VARIABLE_GOOGLE_CLIENT_ID),
		"client_secret": os.Getenv(ENV_VARIABLE_GOOGLE_CLIENT_SECRET),
		"redirect_uri":  GetAuthRedirectURL(),
		"grant_type":    "authorization_code",
	}

	payload, _ := json.Marshal(data)

	// build request object
	req, err := http.NewRequest(
		http.MethodPost,
		GOOGLE_OAUTH_SERVER_ACCESS_TOKEN_END_POINT_URL,
		bytes.NewBuffer(payload),
	)

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToBuildAccessTokenRequest,
			getServiceErrorOrigin("exchangeAuthCodeForAccessToken"),
			err.Error(),
		)
	}
	response, err := authStrategy.httpClient.Do(req)

	// Make POST request

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToBuildAccessTokenRequest,
			getServiceErrorOrigin("exchangeAuthCodeForAccessToken"),
			err.Error(),
		)
	}
	defer response.Body.Close()

	// Parse response
	var token OAuthServerTokensResponse
	if err := json.NewDecoder(response.Body).Decode(&token); err != nil {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToParseAccessTokenResponse,
			getServiceErrorOrigin("exchangeAuthCodeForAccessToken"),
			err.Error(),
		)
	}
	if token.AccessToken == "" {
		return nil, apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToGetAccessToken,
			getServiceErrorOrigin("exchangeAuthCodeForAccessToken"),
			token.Error+":"+token.ErrorDescription,
		)
	}

	return &token, nil

}
