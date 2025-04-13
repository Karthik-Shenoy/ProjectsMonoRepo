package auth_helpers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"pragmatism/api"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/services/telemetryservice"
)

func AuthenticateFromToken(token *api.AuthToken) bool {
	key := os.Getenv(ENV_VARIABLE_SHA_SECRET)

	decodedSignature, err := hex.DecodeString(token.Signature)

	if err != nil {
		telemetryservice.GetInstance().LogError(apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToParseAuthenticationToken,
			getServiceErrorOrigin("AuthenticateFromToken"),
			fmt.Sprintf("token=%s,err=%s", token.Signature, err.Error()),
		))
		return false
	}

	payload, err := hex.DecodeString(token.Payload)

	if err != nil {
		telemetryservice.GetInstance().LogError(apperrors.NewAppError(
			apperrors.AuthHelpers_NonRetryable_FailedToDecodeAuthenticationTokenPayload,
			getServiceErrorOrigin("AuthenticateFromToken"),
			err.Error(),
		))
		return false
	}

	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(payload))
	expectedMAC := mac.Sum(nil)

	return hmac.Equal(expectedMAC, decodedSignature)
}
