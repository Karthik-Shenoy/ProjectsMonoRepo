package utils

func RemoveBase64padding(payload string) string {
	payloadEnd := len(payload)
	for payloadEnd >= 0 && payload[payloadEnd-1] == '=' {
		payloadEnd--
	}
	return payload[:payloadEnd]
}
