package auth

import "pragmatism/internal/helpers"

const ENV_VARIABLE_GOOGLE_CLIENT_ID = "OAUTH_SERVICE_CONFIG_GOOGLE_CLIENT_ID"
const ENV_VARIABLE_GOOGLE_CLIENT_SECRET = "OAUTH_SERVICE_CONFIG_GOOGLE_CLIENT_SECRET"
const ENV_VARIABLE_SHA_SECRET = "OAUTH_SERVICE_CONFIG_SHA_SECRET"

func GetAuthRedirectURL() string {
	if helpers.IsDevMode {
		return "http://127.0.0.1:3000/auth/callback"
	}
	return "https://www.pragmatism.shenoyk.com/api/auth/callback"
}
