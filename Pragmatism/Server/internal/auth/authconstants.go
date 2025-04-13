package auth

import (
	"net/http"
	"pragmatism/internal/cmdflags"
)

const ENV_VARIABLE_GOOGLE_CLIENT_ID = "OAUTH_SERVICE_CONFIG_GOOGLE_CLIENT_ID"
const ENV_VARIABLE_GOOGLE_CLIENT_SECRET = "OAUTH_SERVICE_CONFIG_GOOGLE_CLIENT_SECRET"
const ENV_VARIABLE_SHA_SECRET = "OAUTH_SERVICE_CONFIG_SHA_SECRET"

func GetOauthCallbackTemplatePath() string {
	if cmdflags.IsDevMode() {
		return "./internal/auth/templates/oauth-redirect-page.html"
	}
	return "./public/templates/oauth-redirect-page.html"
}

func GetAuthCookieSameSiteMode() http.SameSite {
	if cmdflags.IsDevMode() {
		return http.SameSiteNoneMode
	}
	return http.SameSiteStrictMode
}
