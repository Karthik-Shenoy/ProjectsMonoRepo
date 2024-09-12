import { interop } from "../Interop/Interop";

export type RTCMessage =
    | interop.InitMessage
    | interop.GameStartMessage
    | interop.WordMessage
    | interop.DeathMessage
    | interop.GameStartBroadcastMessage;
export interface RTCMessageSubscriber {
    handleRTCMessage: (message: RTCMessage) => void;
}
