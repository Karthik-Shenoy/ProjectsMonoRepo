package rtcUtils

import (
	"encoding/json"
	"fmt"
	"word-roulette/interop"
)

func ReadMessageDiscriminator(payload []byte) (*interop.RTCMessageDiscriminator, error) {
	msgDiscriminator := interop.RTCMessageDiscriminator{
		MessageType: -1,
	}

	err := json.Unmarshal(payload, &msgDiscriminator)

	if err != nil || msgDiscriminator.MessageType < 0 {
		return nil, fmt.Errorf("rtcUtils.readMsgDiscriminator: Some issue ocurred when un-marshalling the rtc message %s", err)
	}
	return &msgDiscriminator, nil
}
