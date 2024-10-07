"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainPageController = void 0;
const API_1 = require("../../API/API");
const GameState_1 = require("../../App/GameState");
const Interop_1 = require("../../Interop/Interop");
const RTCManager_1 = require("../../RTC/RTCManager");
const Constants_1 = require("../../Shared/Constants");
class MainPageController {
    constructor(startGameCallback) {
        this.startGameCallback = startGameCallback;
        this.switchToLobby = (userName, roomCode) => {
            if (!this.didCreateGame) {
                this.hideStartGameButton();
            }
            this.hideError();
            this.hideMenuPage();
            this.showLobbyPage();
            const roomCodeSpan = document.getElementById(Constants_1.HTMLElementIds.roomCodeSpan);
            roomCodeSpan.innerText = roomCode;
            this.addPlayerToList(userName);
        };
        this.createGameHandler = () => {
            this.didCreateGame = true;
            const userNameInputElement = document.getElementById(Constants_1.HTMLElementIds.userNameInput);
            const roomInputElement = document.getElementById(Constants_1.HTMLElementIds.roomInput);
            const [userName, roomId] = [userNameInputElement.value, roomInputElement.value];
            if (userName === "" || roomId === "") {
                this.showError("Please enter a valid username and room id");
                return;
            }
            GameState_1.GameState.getInstance().setLocalPlayerName(userName);
            API_1.API.createGame(userName, roomId).then(() => {
                this.switchToLobby(userName, roomId);
                const rtcManger = RTCManager_1.RTCManager.getInstance();
                rtcManger.sendInitSignal(userName, roomId);
            }, (error) => {
                this.showError(error);
            });
        };
        this.joinGameHandler = () => {
            const userNameInputElement = document.getElementById(Constants_1.HTMLElementIds.userNameInput);
            const roomInputElement = document.getElementById(Constants_1.HTMLElementIds.roomInput);
            const [userName, roomId] = [userNameInputElement.value, roomInputElement.value];
            if (userName === "" || roomId === "") {
                this.showError("Please enter a valid username and room id");
            }
            GameState_1.GameState.getInstance().setLocalPlayerName(userName);
            API_1.API.joinGame(userName, roomId).then((response) => {
                this.switchToLobby(userName, roomId);
                const rtcManger = RTCManager_1.RTCManager.getInstance();
                console.log(response);
                for (const playerName of response.playerList) {
                    this.addPlayerToList(playerName);
                }
                rtcManger.sendInitSignal(userName, roomId);
            }, (err) => {
                this.showError(err);
            });
        };
        this.startGameHandler = () => {
            this.startGameCallback();
            RTCManager_1.RTCManager.getInstance().sendGameStartSignal();
            this.dispose();
        };
        this.addPlayerToList = (playerName) => {
            const playerList = document.getElementById(Constants_1.HTMLElementIds.playerList);
            playerList.appendChild(document.createElement("li")).innerText = playerName;
        };
        this.mainMenuContainer = document.getElementById(Constants_1.HTMLElementIds.mainMenuContainer);
        this.menuPageElement = document.getElementById(Constants_1.HTMLElementIds.menuPage);
        this.lobbyPageElement = document.getElementById(Constants_1.HTMLElementIds.lobbyPage);
        this.errorOutputDiv = document.getElementById(Constants_1.HTMLElementIds.errorOutput);
        // hide lobby page
        this.hideLobbyPage();
        this.hideError();
        this.attachEventListeners();
        this.didCreateGame = false;
        RTCManager_1.RTCManager.getInstance().addRTCMessageSubscriber(Interop_1.interop.MessageType.INIT, this);
        RTCManager_1.RTCManager.getInstance().addRTCMessageSubscriber(Interop_1.interop.MessageType.GAME_START_BROADCAST, this);
    }
    dispose() {
        this.menuPageElement.style.display = "none";
        this.lobbyPageElement.style.display = "none";
        this.mainMenuContainer.style.display = "none";
        this.detachEventListeners();
    }
    handleRTCMessage(message) {
        switch (message.messageType) {
            case Interop_1.interop.MessageType.INIT:
                this.addPlayerToList(message.userName);
                return;
            case Interop_1.interop.MessageType.GAME_START_BROADCAST:
                this.dispose();
                this.startGameCallback();
                return;
        }
    }
    attachEventListeners() {
        const createGameButton = document.getElementById(Constants_1.HTMLElementIds.createGameButton);
        const joinGameButton = document.getElementById(Constants_1.HTMLElementIds.joinGameButton);
        const startGameButton = document.getElementById(Constants_1.HTMLElementIds.startGameButton);
        createGameButton.addEventListener("click", this.createGameHandler);
        joinGameButton.addEventListener("click", this.joinGameHandler);
        startGameButton.addEventListener("click", this.startGameHandler);
    }
    detachEventListeners() {
        const createGameButton = document.getElementById(Constants_1.HTMLElementIds.createGameButton);
        const joinGameButton = document.getElementById(Constants_1.HTMLElementIds.joinGameButton);
        const startGameButton = document.getElementById(Constants_1.HTMLElementIds.startGameButton);
        createGameButton.removeEventListener("click", this.createGameHandler);
        joinGameButton.removeEventListener("click", this.joinGameHandler);
        startGameButton.removeEventListener("click", this.startGameHandler);
    }
    showError(error) {
        this.errorOutputDiv.style.display = "block";
        this.errorOutputDiv.innerText = error;
    }
    hideError() {
        this.errorOutputDiv.style.display = "none";
    }
    hideMenuPage() {
        this.menuPageElement.style.display = "none";
    }
    hideStartGameButton() {
        const startGameButton = document.getElementById(Constants_1.HTMLElementIds.startGameButton);
        startGameButton.style.display = "none";
    }
    hideLobbyPage() {
        this.lobbyPageElement.style.display = "none";
    }
    showLobbyPage() {
        this.lobbyPageElement.style.display = "block";
    }
}
exports.MainPageController = MainPageController;
