package auth_helpers

import (
	"pragmatism/api"
	"pragmatism/internal/apperrors"
)

// Auh strategy expose just the authenticate user API
// The concrete implementors will implement their own strategy based on the context
// The concrete strategies use `constructor injection` to set their context
// strategy object are immutable once constructed
type AuthenticatorStrategy interface {
	// based on context
	Authenticate() (bool, *apperrors.AppError)
	GenerateAuthToken() (*api.AuthToken, *apperrors.AppError)
}
