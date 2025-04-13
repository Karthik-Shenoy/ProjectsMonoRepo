package auth_helpers

import "pragmatism/internal/cmdflags"

const ENV_VARIABLE_GOOGLE_CLIENT_ID = "OAUTH_SERVICE_CONFIG_GOOGLE_CLIENT_ID"
const ENV_VARIABLE_GOOGLE_CLIENT_SECRET = "OAUTH_SERVICE_CONFIG_GOOGLE_CLIENT_SECRET"
const ENV_VARIABLE_SHA_SECRET = "OAUTH_SERVICE_CONFIG_SHA_SECRET"

// Google OAuth token endpoint
const GOOGLE_OAUTH_SERVER_ACCESS_TOKEN_END_POINT_URL = "https://oauth2.googleapis.com/token"

const GOOGLE_USER_INFO_END_POINT_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

func GetAuthRedirectURL() string {
	if cmdflags.IsDevMode() {
		return "http://127.0.0.1:3000/auth/callback"
	}
	return "https://www.pragmatism.shenoyk.com/api/auth/callback"
}

type OAuthServerTokensResponse struct {
	AccessToken string `json:"access_token"`
	IDToken     string `json:"id_token"`
	// space separated scopes for the given token
	Scope        string `json:"scope"`
	RefreshToken string `json:"refresh_token"`

	// should be checked only if token is empty
	Error string `json:"error"`
	// should be checked only if token is empty
	ErrorDescription string `json:"error_description"`
}
