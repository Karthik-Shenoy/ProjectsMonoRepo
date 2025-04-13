package middlewares

import "pragmatism/internal/cmdflags"

func GetAllowedOrigin() string {
	if cmdflags.IsDevMode() {
		return "http://localhost:5173"
	}
	return "https://pragmatism.shenoyk.com"
}
