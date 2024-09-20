"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const PlayerController_1 = require("../Controllers/PlayerController");
const Interop_1 = require("../Interop/Interop");
const GameRenderer_1 = require("../Renderer/GameRenderer");
const RTCManager_1 = require("../RTC/RTCManager");
/**
 * - Holds the state of the entire game
 * - Synced with the server
 */
class GameState {
    static getInstance() {
        if (!this.instance) {
            throw Error("Game state is not initialized");
        }
        return this.instance;
    }
    static init(roundController, localPlayerUsername) {
        this.instance = new GameState(roundController, localPlayerUsername);
    }
    get drawableObjectsList() {
        return this._drawableObjectsList;
    }
    get canvasDimensions() {
        return GameRenderer_1.GameRenderer.getInstance().canvasDimensions;
    }
    addDrawableObject(drawableObject) {
        this._drawableObjectsList.push(drawableObject);
    }
    addPlayer(playerController) {
        this.addDrawableObject(playerController);
        this.roundController.addPlayer(playerController);
    }
    setLocalPlayerName(userName) {
        var _a;
        this.localPlayerUsername = userName;
        (_a = this.localPlayerController) === null || _a === void 0 ? void 0 : _a.setUserName(userName);
    }
    getLocalPlayerName() {
        return this.localPlayerUsername;
    }
    getPlayerControllersList() {
        return this.roundController.getPlayerControllersList();
    }
    handleRTCMessage(message) {
        if (message.messageType === Interop_1.interop.MessageType.GAME_START_BROADCAST) {
            Object.keys(message.positionMap).forEach(() => {
                const remotePlayerController = new PlayerController_1.PlayerController();
                remotePlayerController.setRemotePlayer();
                this.addPlayer(remotePlayerController);
            });
            Object.keys(message.positionMap).forEach((username) => {
                const position = message.positionMap[username];
                if (username == this.localPlayerUsername) {
                    this.localPlayerController = this.roundController.getPlayerAtPosition(position);
                    this.localPlayerController.setLocalPlayer();
                }
                this.roundController.getPlayerAtPosition(position).setUserName(username);
            });
        }
        // start round and rendering
        this.roundController.startRound();
        this.playBgMusic();
        GameRenderer_1.GameRenderer.getInstance().render();
    }
    playBgMusic() {
        this.bgmMusicAudio.play();
    }
    constructor(roundController, localPlayerUsername) {
        this.roundController = roundController;
        this.localPlayerUsername = localPlayerUsername;
        this._drawableObjectsList = [];
        this.localPlayerController = null;
        RTCManager_1.RTCManager.getInstance().addRTCMessageSubscriber(Interop_1.interop.MessageType.GAME_START_BROADCAST, this);
        this.bgmMusicAudio = document.createElement("audio");
        this.bgmMusicAudio.src = "/dist/public/audio/bgm.mp3";
        this.bgmMusicAudio.loop = true;
        this.bgmMusicAudio.volume = 1;
        document.body.appendChild(this.bgmMusicAudio);
    }
}
exports.GameState = GameState;
