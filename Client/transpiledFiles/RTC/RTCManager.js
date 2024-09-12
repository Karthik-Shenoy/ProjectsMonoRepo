"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTCManager = void 0;
const Interop_1 = require("../Interop/Interop");
const Constants_1 = require("../Shared/Constants");
class RTCManager {
    constructor() {
        this.rtcEventSubscribers = new Map();
        this.isSocketOpen = () => new Promise((resolve) => {
            if (this.webSocketConnection.readyState === WebSocket.OPEN) {
                resolve();
            }
            else {
                this.webSocketConnection.onopen = () => resolve();
            }
        });
        this.sendInitSignal = (userName, roomId) => {
            this.isSocketOpen().then(() => {
                this.webSocketConnection.send(JSON.stringify({
                    messageType: Interop_1.interop.MessageType.INIT,
                    userName,
                    roomId,
                }));
            });
        };
        this.sendGameStartSignal = () => {
            this.isSocketOpen().then(() => {
                this.webSocketConnection.send(JSON.stringify({
                    messageType: Interop_1.interop.MessageType.GAME_START,
                }));
            });
        };
        this.sendDeathSignal = () => {
            this.isSocketOpen().then(() => {
                this.webSocketConnection.send(JSON.stringify({
                    messageType: Interop_1.interop.MessageType.DEATH,
                }));
            });
        };
        this.sendWord = (word, userName) => {
            this.isSocketOpen().then(() => {
                this.webSocketConnection.send(JSON.stringify({
                    messageType: Interop_1.interop.MessageType.WORD,
                    word,
                    userName,
                }));
            });
        };
        this.onInitMessage = (message) => {
            var _a;
            (_a = this.rtcEventSubscribers
                .get(message.messageType)) === null || _a === void 0 ? void 0 : _a.forEach((subscriber) => subscriber.handleRTCMessage(message));
        };
        this.onDeathMessage = (message) => {
            var _a;
            (_a = this.rtcEventSubscribers
                .get(message.messageType)) === null || _a === void 0 ? void 0 : _a.forEach((subscriber) => subscriber.handleRTCMessage(message));
        };
        this.onWordMessage = (message) => {
            var _a;
            (_a = this.rtcEventSubscribers
                .get(message.messageType)) === null || _a === void 0 ? void 0 : _a.forEach((subscriber) => subscriber.handleRTCMessage(message));
        };
        this.onGameStartMessage = (message) => {
            var _a;
            (_a = this.rtcEventSubscribers
                .get(message.messageType)) === null || _a === void 0 ? void 0 : _a.forEach((subscriber) => subscriber.handleRTCMessage(message));
        };
        this.onGameStartBroadcastMessage = (message) => {
            var _a;
            (_a = this.rtcEventSubscribers
                .get(message.messageType)) === null || _a === void 0 ? void 0 : _a.forEach((subscriber) => subscriber.handleRTCMessage(message));
        };
        this.waitForNextWordMessage = () => {
            return new Promise((resolve) => {
                const eventListener = (event) => {
                    const message = JSON.parse(event.data);
                    if (message.messageType === Interop_1.interop.MessageType.WORD) {
                        this.webSocketConnection.removeEventListener("message", eventListener);
                        resolve(message.word);
                    }
                };
                this.webSocketConnection.addEventListener("message", eventListener);
            });
        };
        this.attachEventListeners = () => {
            this.webSocketConnection.addEventListener("message", (event) => {
                const message = JSON.parse(event.data);
                switch (message.messageType) {
                    case Interop_1.interop.MessageType.INIT:
                        this.onInitMessage(message);
                        break;
                    case Interop_1.interop.MessageType.GAME_START:
                        this.onGameStartMessage(message);
                        break;
                    case Interop_1.interop.MessageType.DEATH:
                        this.onDeathMessage(message);
                        break;
                    case Interop_1.interop.MessageType.GAME_START_BROADCAST:
                        this.onGameStartBroadcastMessage(message);
                        break;
                }
            });
        };
        this.webSocketConnection = new WebSocket(`${Constants_1.GAME_SERVER_URL}/rtc`);
        this.attachEventListeners();
    }
    static getInstance() {
        if (!RTCManager.instance) {
            RTCManager.instance = new RTCManager();
        }
        return RTCManager.instance;
    }
    addRTCMessageSubscriber(messageType, subscriber) {
        let rtcMessageSubscribers = this.rtcEventSubscribers.get(messageType);
        if (!rtcMessageSubscribers) {
            rtcMessageSubscribers = [];
        }
        rtcMessageSubscribers.push(subscriber);
        this.rtcEventSubscribers.set(messageType, rtcMessageSubscribers);
    }
}
exports.RTCManager = RTCManager;
