import { interop } from "../Interop/Interop";
import { GAME_SERVER_URL } from "../Shared/Constants";
import { RTCMessage, RTCMessageSubscriber } from "./RTCTypes";

export class RTCManager {
    private static instance: RTCManager;

    private rtcEventSubscribers: Map<interop.MessageType, Array<RTCMessageSubscriber>> = new Map();
    private webSocketConnection: WebSocket;
    private constructor() {
        this.webSocketConnection = new WebSocket(`${GAME_SERVER_URL}/rtc`);
        this.attachEventListeners();
    }

    public static getInstance(): RTCManager {
        if (!RTCManager.instance) {
            RTCManager.instance = new RTCManager();
        }
        return RTCManager.instance;
    }

    private isSocketOpen = () =>
        new Promise<void>((resolve) => {
            if (this.webSocketConnection.readyState === WebSocket.OPEN) {
                resolve();
            } else {
                this.webSocketConnection.onopen = () => resolve();
            }
        });

    public sendInitSignal = (userName: string, roomId: string) => {
        this.isSocketOpen().then(() => {
            this.webSocketConnection.send(
                JSON.stringify({
                    messageType: interop.MessageType.INIT,
                    userName,
                    roomId,
                })
            );
        });
    };

    public sendGameStartSignal = () => {
        this.isSocketOpen().then(() => {
            this.webSocketConnection.send(
                JSON.stringify({
                    messageType: interop.MessageType.GAME_START,
                })
            );
        });
    };

    public sendDeathSignal = () => {
        this.isSocketOpen().then(() => {
            this.webSocketConnection.send(
                JSON.stringify({
                    messageType: interop.MessageType.DEATH,
                })
            );
        });
    };

    public sendWord = (word: string, score:number, userName: string) => {
        this.isSocketOpen().then(() => {
            this.webSocketConnection.send(
                JSON.stringify({
                    messageType: interop.MessageType.WORD,
                    word,
                    userName,
                    score,
                })
            );
        });
    };

    public onInitMessage = (message: RTCMessage) => {
        this.rtcEventSubscribers
            .get(message.messageType)
            ?.forEach((subscriber) => subscriber.handleRTCMessage(message));
    };

    public onDeathMessage = (message: RTCMessage) => {
        this.rtcEventSubscribers
            .get(message.messageType)
            ?.forEach((subscriber) => subscriber.handleRTCMessage(message));
    };

    public onWordMessage = (message: RTCMessage) => {
        this.rtcEventSubscribers
            .get(message.messageType)
            ?.forEach((subscriber) => subscriber.handleRTCMessage(message));
    };

    public onGameStartMessage = (message: RTCMessage) => {
        this.rtcEventSubscribers
            .get(message.messageType)
            ?.forEach((subscriber) => subscriber.handleRTCMessage(message));
    };

    public onGameStartBroadcastMessage = (message: RTCMessage) => {
        this.rtcEventSubscribers
            .get(message.messageType)
            ?.forEach((subscriber) => subscriber.handleRTCMessage(message));
    };

    // [word, score]
    public waitForNextWordMessage = (): Promise<[string, number]> => {
        return new Promise<[string, number]>((resolve) => {
            const eventListener = (event: MessageEvent<any>) => {
                const message: RTCMessage = JSON.parse(event.data);
                if (message.messageType === interop.MessageType.WORD) {
                    this.webSocketConnection.removeEventListener("message", eventListener);
                    resolve([message.word, message.score]);
                }
            };

            this.webSocketConnection.addEventListener("message", eventListener);
        });
    };

    public addRTCMessageSubscriber(
        messageType: interop.MessageType,
        subscriber: RTCMessageSubscriber
    ) {
        let rtcMessageSubscribers = this.rtcEventSubscribers.get(messageType);
        if (!rtcMessageSubscribers) {
            rtcMessageSubscribers = [];
        }
        rtcMessageSubscribers.push(subscriber);
        this.rtcEventSubscribers.set(messageType, rtcMessageSubscribers);
    }

    private attachEventListeners = () => {
        this.webSocketConnection.addEventListener("message", (event) => {
            const message: RTCMessage = JSON.parse(event.data);
            switch (message.messageType) {
                case interop.MessageType.INIT:
                    this.onInitMessage(message);
                    break;
                case interop.MessageType.GAME_START:
                    this.onGameStartMessage(message);
                    break;
                case interop.MessageType.DEATH:
                    this.onDeathMessage(message);
                    break;
                case interop.MessageType.GAME_START_BROADCAST:
                    this.onGameStartBroadcastMessage(message);
                    break;
            }
        });
    };
}
