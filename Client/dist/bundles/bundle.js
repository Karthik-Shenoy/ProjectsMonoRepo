(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const Constants_1 = require("../Shared/Constants");
var API;
(function (API) {
    API.createGame = (userName, roomId) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${Constants_1.GAME_SERVER_URL}/create-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                roomId,
            }),
        });
        switch (response.status) {
            case 200: {
                return response;
            }
            case 400: {
                throw new Error("Room already exists");
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    });
    API.joinGame = (userName, roomId) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${Constants_1.GAME_SERVER_URL}/join-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                roomId,
            }),
        });
        switch (response.status) {
            case 200: {
                return yield response.json();
            }
            case 400: {
                throw new Error("Room does not exist");
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    });
    API.isWordValid = (word) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${Constants_1.GAME_SERVER_URL}/isWordValid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                word
            }),
        });
        switch (response.status) {
            case 200: {
                return yield response.json();
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    });
})(API || (exports.API = API = {}));

},{"../Shared/Constants":15}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const MainMenuController_1 = require("../Controllers/MainMenuController/MainMenuController");
const RoundController_1 = require("../Controllers/RoundController");
const Constants_1 = require("../Shared/Constants");
const GameState_1 = require("./GameState");
var App;
(function (App) {
    let isAppRunning = false;
    App.MainMenu = () => {
        // hide the game instance
        const gameContainer = document.getElementById(Constants_1.HTMLElementIds.gameContainer);
        gameContainer.style.display = "none";
        App.initGame("");
        new MainMenuController_1.MainPageController(() => {
            gameContainer.style.display = "flex";
        });
    };
    App.initGame = (localPlayerUsername) => {
        if (!isAppRunning) {
            isAppRunning = true;
            const roundController = new RoundController_1.RoundController();
            GameState_1.GameState.init(roundController, localPlayerUsername);
        }
    };
})(App || (exports.App = App = {}));

},{"../Controllers/MainMenuController/MainMenuController":6,"../Controllers/RoundController":8,"../Shared/Constants":15,"./GameState":3}],3:[function(require,module,exports){
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
        this.bgmMusicAudio.src = "/public/audio/bgm.mp3";
        this.bgmMusicAudio.loop = true;
        this.bgmMusicAudio.volume = 1;
        document.body.appendChild(this.bgmMusicAudio);
    }
}
exports.GameState = GameState;

},{"../Controllers/PlayerController":7,"../Interop/Interop":11,"../RTC/RTCManager":12,"../Renderer/GameRenderer":13}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoDialogController = void 0;
const Constants_1 = require("../../Shared/Constants");
class InfoDialogController {
    constructor(message) {
        this.dispose = () => {
            this.dialogElement.close();
        };
        this.dialogElement = document.getElementById(Constants_1.HTMLElementIds.dialog);
        this.dialogElement.showModal();
        // hide word prompt content
        const wordPromptDialogContent = document.getElementById(Constants_1.HTMLElementIds.wordPromptDialogContent);
        wordPromptDialogContent.style.display = "none";
        // show info content
        const infoDialogContent = document.getElementById(Constants_1.HTMLElementIds.infoDialogContent);
        infoDialogContent.style.display = "flex";
        const infoDialogText = document.getElementById(Constants_1.HTMLElementIds.infoDialogText);
        infoDialogText.innerText = message;
    }
}
exports.InfoDialogController = InfoDialogController;

},{"../../Shared/Constants":15}],5:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDialogController = void 0;
const API_1 = require("../../API/API");
const GameState_1 = require("../../App/GameState");
const RTCManager_1 = require("../../RTC/RTCManager");
const Constants_1 = require("../../Shared/Constants");
const Utils_1 = require("../Utils");
const enterKey = "Enter";
class InputDialogController {
    constructor(previousWord) {
        this.previousWord = previousWord;
        this.setOnSubmitCallback = (callback) => {
            this.submitCallback = callback;
        };
        this.dispose = () => {
            this.dialogElement.close();
            this.submitButton.onclick = null;
            this.submitCallback = undefined;
            clearTimeout(this.setTimeoutHandle);
        };
        this.submitHandler = (shouldSubmitEmpty = false) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let word = this.wordInputTextBox.value.toLowerCase().trim();
            try {
                if (shouldSubmitEmpty) {
                    word = "";
                }
                !shouldSubmitEmpty && (yield this.validateWord(word));
                this.hideErrorOutputDiv();
                const score = this.getScore(word);
                (_a = this.submitCallback) === null || _a === void 0 ? void 0 : _a.call(this, word, score);
                RTCManager_1.RTCManager.getInstance().sendWord(word, score, GameState_1.GameState.getInstance().getLocalPlayerName());
                this.wordInputTextBox.value = "";
                this.dispose();
            }
            catch (error) {
                this.showError(error.message);
            }
        });
        this.validateWord = (word) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            if (word.length === 0) {
                throw new Error("Word cannot be empty");
            }
            const response = yield API_1.API.isWordValid(word);
            if (!response.isValid) {
                throw new Error("the given word is not valid english word");
            }
            // check if word includes any of the random chars
            if (!((_b = this.currRandomChars) === null || _b === void 0 ? void 0 : _b.some((char) => word.includes(char))) ||
                ((_c = this.currRandomChars) === null || _c === void 0 ? void 0 : _c.filter((char) => word.includes(char)).length) < 1) {
                throw new Error("Word does not contain any of the random chars");
            }
            if (this.previousWord.length > 0 &&
                word[0].toLowerCase() !== this.previousWord[this.previousWord.length - 1].toLowerCase()) {
                throw new Error("Word does not start with the correct letter");
            }
            // check if word is present in english using api call
        });
        this.createTimer = () => {
            const timerText = document.getElementById(Constants_1.HTMLElementIds.timerText);
            const updateTime = (time) => {
                timerText.innerText = time.toString();
                if (time >= Constants_1.WORD_ENTRY_TIME) {
                    this.submitHandler(true);
                    return;
                }
                this.setTimeoutHandle = setTimeout(updateTime, 1000, time + 1);
            };
            this.setTimeoutHandle = setTimeout(updateTime, 0, 0);
        };
        // improve code quality
        this.currRandomChars = Utils_1.GenericUtils.getRandomChars(previousWord.length > 0 ? [previousWord[previousWord.length - 1].toLowerCase()] : []);
        this.dialogElement = document.getElementById(Constants_1.HTMLElementIds.dialog);
        this.dialogElement.showModal();
        // hide info content
        const infoDialogContent = document.getElementById(Constants_1.HTMLElementIds.infoDialogContent);
        infoDialogContent.style.display = "none";
        // show word prompt content
        const wordPromptDialogContent = document.getElementById(Constants_1.HTMLElementIds.wordPromptDialogContent);
        wordPromptDialogContent.style.display = "flex";
        this.wordInputTextBox = document.getElementById(Constants_1.HTMLElementIds.wordInputTextBox);
        this.wordInputTextBox.focus();
        this.submitButton = document.getElementById(Constants_1.HTMLElementIds.submitButton);
        this.submitButton.onclick = () => {
            this.submitHandler();
        };
        this.wordInputTextBox.onkeydown = (event) => {
            if (event.key === enterKey) {
                this.submitHandler();
            }
        };
        this.updatePreviousWordPrompt();
        this.createTimer();
    }
    updatePreviousWordPrompt() {
        var _a, _b;
        // move to a different function
        const randomCharsSpan = document.getElementById(Constants_1.HTMLElementIds.randomCharsSpan);
        randomCharsSpan.textContent = (_b = (_a = this.currRandomChars) === null || _a === void 0 ? void 0 : _a.join(", ")) !== null && _b !== void 0 ? _b : "";
        const firstPreviousWordPrompt = document.getElementById(Constants_1.HTMLElementIds.firstPreviousWordPrompt);
        const previousWordPrompt = document.getElementById(Constants_1.HTMLElementIds.previousWordPrompt);
        if (!this.previousWord) {
            previousWordPrompt.style.display = "none";
            return;
        }
        previousWordPrompt.style.display = "block";
        firstPreviousWordPrompt.style.display = "none";
        const previousWordSpan = document.getElementById(Constants_1.HTMLElementIds.previousWordSpan);
        previousWordSpan.textContent = this.previousWord;
    }
    getScore(word) {
        var _a, _b;
        return (word.length +
            (((_a = this.currRandomChars) === null || _a === void 0 ? void 0 : _a.some((char) => word.includes(char)))
                ? (_b = this.currRandomChars) === null || _b === void 0 ? void 0 : _b.filter((char) => word.includes(char)).length
                : 0) *
                10);
    }
    showError(error) {
        const wordErrorOutput = document.getElementById(Constants_1.HTMLElementIds.wordErrorOutput);
        wordErrorOutput.style.display = "block";
        wordErrorOutput.innerText = error;
    }
    hideErrorOutputDiv() {
        const wordErrorOutput = document.getElementById(Constants_1.HTMLElementIds.wordErrorOutput);
        wordErrorOutput.style.display = "none";
    }
}
exports.InputDialogController = InputDialogController;

},{"../../API/API":1,"../../App/GameState":3,"../../RTC/RTCManager":12,"../../Shared/Constants":15,"../Utils":10}],6:[function(require,module,exports){
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

},{"../../API/API":1,"../../App/GameState":3,"../../Interop/Interop":11,"../../RTC/RTCManager":12,"../../Shared/Constants":15}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const RTCManager_1 = require("../RTC/RTCManager");
const InfoDialogController_1 = require("./DialogController/InfoDialogController");
const InputDialogController_1 = require("./DialogController/InputDialogController");
const Utils_1 = require("./Utils");
var Highlight;
(function (Highlight) {
    Highlight[Highlight["Turn"] = 0] = "Turn";
    Highlight[Highlight["DeathHighlight"] = 1] = "DeathHighlight";
    Highlight[Highlight["None"] = 2] = "None";
})(Highlight || (Highlight = {}));
class PlayerController {
    constructor() {
        this.setUserName = (username) => {
            this.username = username;
        };
        // turn->takeInput
        // highlight
        this.highlight = () => {
            this.highlightType = Highlight.DeathHighlight;
        };
        this.removeHighlight = () => {
            this.highlightType = Highlight.None;
        };
        this.highlightTurn = () => {
            this.highlightType = Highlight.Turn;
        };
        // render
        this.render = (ctx) => {
            if (!this.isAlive) {
                return;
            }
            const { x, y } = this.coordinates;
            // set state machine
            ctx.fillStyle = "red";
            // draw
            const { x: rectX, y: rectY } = Utils_1.MathUtils.getRectDrawCoordinates(x, y, 20, 20);
            ctx.fillRect(rectX, rectY, 20, 20);
            ctx.fillText(this.username, rectX, rectY + 60);
            if (this.highlightType !== Highlight.None) {
                ctx.lineWidth = 2;
                if (this.highlightType === Highlight.Turn) {
                    ctx.strokeStyle = "green";
                }
                else {
                    ctx.strokeStyle = "red";
                }
                ctx.beginPath();
                ctx.arc(x, y, 30, 0, 2 * Math.PI);
                ctx.stroke();
            }
            //reset state machine
        };
        this.setRemotePlayer = () => {
            this.isLocalPlayer = false;
        };
        this.setLocalPlayer = () => {
            this.isLocalPlayer = true;
        };
        this.getPlayerInput = (previousWord, lastDeadPlayerName) => {
            if (this.isLocalPlayer) {
                return new Promise((resolve, _reject) => {
                    const dialogController = new InputDialogController_1.InputDialogController(previousWord);
                    dialogController.setOnSubmitCallback((text, score) => {
                        resolve(text);
                        this.score += score;
                    });
                });
            }
            return new Promise((resolve) => {
                let infoDialog = null;
                if (!previousWord) {
                    if (lastDeadPlayerName) {
                        infoDialog = new InfoDialogController_1.InfoDialogController(`${lastDeadPlayerName} killed themselves \u{1F602}. Waiting for ${this.username} to enter the word`);
                    }
                    else {
                        infoDialog = new InfoDialogController_1.InfoDialogController(`Waiting for ${this.username} to enter the word`);
                    }
                }
                else {
                    if (lastDeadPlayerName) {
                        infoDialog = new InfoDialogController_1.InfoDialogController(`${lastDeadPlayerName} killed himself \u{1F602}. Last word was ${previousWord}. Waiting for ${this.username} to enter the word`);
                    }
                    else {
                        infoDialog = new InfoDialogController_1.InfoDialogController(`Last word was ${previousWord}. Waiting for ${this.username} to enter the word`);
                    }
                }
                RTCManager_1.RTCManager.getInstance()
                    .waitForNextWordMessage()
                    .then(([word, score]) => {
                    resolve(word);
                    this.score += score;
                    infoDialog === null || infoDialog === void 0 ? void 0 : infoDialog.dispose();
                });
            });
        };
        this.coordinates = { x: 0, y: 0 };
        this.isAlive = true;
        this.isLocalPlayer = true;
        this.highlightType = Highlight.None;
        this.username = "";
        this.angle = 0;
        this.score = 0;
    }
    // position self
    set position(newCoordinates) {
        this.coordinates.x = newCoordinates.x;
        this.coordinates.y = newCoordinates.y;
    }
    set angleOfRotation(angle) {
        this.angle = angle >= Math.PI ? Math.PI - angle : angle;
    }
    get isLocal() {
        return this.isLocalPlayer;
    }
    getUserName() {
        return this.username;
    }
    getScore() {
        return this.score;
    }
    kill() {
        this.isAlive = false;
    }
}
exports.PlayerController = PlayerController;

},{"../RTC/RTCManager":12,"./DialogController/InfoDialogController":4,"./DialogController/InputDialogController":5,"./Utils":10}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundController = void 0;
const EventHandlerUtils_1 = require("../Shared/EventHandlerUtils");
const Utils_1 = require("./Utils");
const Utils_2 = require("../Shared/Utils");
const Interop_1 = require("../Interop/Interop");
const InfoDialogController_1 = require("./DialogController/InfoDialogController");
const ScoreBoardController_1 = require("./ScoreboardController/ScoreBoardController");
/**
 * Singleton Controller to control the rounds
 */
class RoundController {
    constructor() {
        this.startRound = () => __awaiter(this, void 0, void 0, function* () {
            if (this.hasGameEnded()) {
                // improve code
                const winner = this.playersList.length > 1
                    ? this.playersList.reduce((prev, curr) => prev.getScore() > curr.getScore() ? prev : curr)
                    : this.playersList[0];
                if (this.playersList.length > 1) {
                    new InfoDialogController_1.InfoDialogController(`Time's up, ${winner.getUserName()} wins! with ${winner.getScore()} points\u{1F929} `);
                }
                else {
                    new InfoDialogController_1.InfoDialogController(`Game Over ${winner.getUserName()} wins! \u{1F929}`);
                }
                return;
            }
            this.positionPlayers();
            this.playersList[this.currentPlayerIndex].highlightTurn();
            const inputText = yield this.getInput(this.previousWord, this.lastDeadPlayerName);
            this.previousWord = inputText;
            const offset = this.validateInput(inputText);
            yield this.highlightPlayers(inputText.length);
            this.playersList[this.currentPlayerIndex].removeHighlight();
            const newPlayerIndex = (this.currentPlayerIndex + offset - 1) % this.playersList.length;
            console.log("new player index", newPlayerIndex, " current player index", this.currentPlayerIndex);
            if (this.currentPlayerIndex === newPlayerIndex) {
                this.playersList[this.currentPlayerIndex].kill();
                this.lastDeadPlayerName = this.playersList[this.currentPlayerIndex].getUserName();
                this.playersList = Utils_2.ContainerUtils.removeFromList(this.playersList, this.currentPlayerIndex);
                this.setCurrPlayerIndex(this.currentPlayerIndex % this.playersList.length);
            }
            else {
                this.setCurrPlayerIndex(newPlayerIndex);
            }
            this.scoreBoardController.updateScoreBoard();
            setTimeout(this.startRound, 0);
        });
        // has possibility of causing deadlock if used in game state
        this.positionPlayers = () => {
            // based on the list length we need x and y on the circle
            const radius = Utils_1.MathUtils.getPlayersCircleRadius();
            const canvasCenter = Utils_1.MathUtils.getCanvasCenter();
            const initPosition = { x: canvasCenter.x + radius, y: canvasCenter.y };
            const dRadAngle = (2 * Math.PI) / this.playersList.length;
            console.log("list length", this.playersList.length);
            this.playersList.forEach((playerController, index) => {
                const { x, y } = Utils_1.MathUtils.rotatePoints(initPosition, canvasCenter, index * dRadAngle);
                playerController.position = { x, y };
                playerController.angleOfRotation = index * dRadAngle;
            });
        };
        this.highlightPlayers = (wordLength) => new Promise((resolve) => {
            let cnt = 0;
            if (wordLength === 0) {
                resolve();
            }
            let currIndex = this.currentPlayerIndex;
            while (cnt < wordLength) {
                const highlight = (highlightIndex, done) => {
                    if (highlightIndex - 1 < 0) {
                        this.playersList[this.playersList.length - 1].removeHighlight();
                    }
                    else {
                        this.playersList[highlightIndex - 1].removeHighlight();
                    }
                    this.playersList[highlightIndex].highlight();
                    console.log("highlighting", highlightIndex);
                    if (done) {
                        setTimeout(() => {
                            this.playersList[highlightIndex].removeHighlight();
                            resolve();
                        });
                    }
                };
                setTimeout(highlight, 1000 * cnt, currIndex, cnt === wordLength - 1);
                currIndex = (currIndex + 1) % this.playersList.length;
                cnt++;
            }
            return;
        });
        this.validateInput = (input) => {
            if (input.length <= 0) {
                return 1;
            }
            return input.length;
        };
        this.getInput = (previousWord, lastDeadPlayerName) => __awaiter(this, void 0, void 0, function* () {
            const playerInput = yield this.playersList[this.currentPlayerIndex].getPlayerInput(previousWord, lastDeadPlayerName);
            return playerInput;
        });
        this.playersList = [];
        this.currentPlayerIndex = 0;
        EventHandlerUtils_1.EventHandlerUtils.getInstance().addWindowResizeHandler(this.positionPlayers);
        this.previousWord = "";
        this.lastDeadPlayerName = "";
        this.scoreBoardController = new ScoreBoardController_1.ScoreboardController();
        this.gameTimerExpired = false;
        setTimeout(() => {
            this.gameTimerExpired = true;
        }, 300 * 1000);
    }
    addPlayer(playerController) {
        this.playersList.push(playerController);
    }
    getPlayerAtPosition(index) {
        return this.playersList[index];
    }
    handleRTCMessage(message) {
        switch (message.messageType) {
            case Interop_1.interop.MessageType.DEATH:
                this.playersList[this.currentPlayerIndex].kill();
                this.playersList = Utils_2.ContainerUtils.removeFromList(this.playersList, this.currentPlayerIndex);
                this.setCurrPlayerIndex(this.currentPlayerIndex % this.playersList.length);
                break;
        }
    }
    getPlayerControllersList() {
        return this.playersList;
    }
    hasGameEnded() {
        return this.playersList.length === 1 || this.gameTimerExpired;
    }
    setCurrPlayerIndex(index) {
        this.currentPlayerIndex = index;
    }
}
exports.RoundController = RoundController;

},{"../Interop/Interop":11,"../Shared/EventHandlerUtils":16,"../Shared/Utils":17,"./DialogController/InfoDialogController":4,"./ScoreboardController/ScoreBoardController":9,"./Utils":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreboardController = void 0;
const GameState_1 = require("../../App/GameState");
const Constants_1 = require("../../Shared/Constants");
class ScoreboardController {
    constructor() {
        this.getScoreBoardListElement = (playerController) => {
            const listElement = document.createElement("div");
            listElement.innerText = `${playerController.getUserName()} : ${playerController.getScore()}`;
            return listElement;
        };
        this.scoreBoardDiv = document.getElementById(Constants_1.HTMLElementIds.scoreBoard);
        this.scoreBoardListElement = undefined;
    }
    updateScoreBoard() {
        this.scoreBoardDiv.style.display = "block";
        if (this.scoreBoardListElement) {
            this.scoreBoardDiv.removeChild(this.scoreBoardListElement);
        }
        this.scoreBoardListElement = document.createElement("div");
        this.scoreBoardListElement.className = Constants_1.HTMLElementIds.scoreBoardList;
        GameState_1.GameState.getInstance()
            .getPlayerControllersList()
            .forEach((playerController) => {
            var _a;
            (_a = this.scoreBoardListElement) === null || _a === void 0 ? void 0 : _a.appendChild(this.getScoreBoardListElement(playerController));
        });
        this.scoreBoardDiv.appendChild(this.scoreBoardListElement);
    }
}
exports.ScoreboardController = ScoreboardController;

},{"../../App/GameState":3,"../../Shared/Constants":15}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderUtils = exports.GenericUtils = exports.MathUtils = void 0;
const GameState_1 = require("../App/GameState");
const Constants_1 = require("../Shared/Constants");
var MathUtils;
(function (MathUtils) {
    MathUtils.getPlayersCircleRadius = () => {
        const { w, h } = GameState_1.GameState.getInstance().canvasDimensions;
        const radius = (Math.min(w, h) * Constants_1.Ratios.canvasToCircle) / 2;
        return radius;
    };
    MathUtils.getCanvasCenter = () => {
        const { w, h } = GameState_1.GameState.getInstance().canvasDimensions;
        return { x: w / 2, y: h / 2 };
    };
    MathUtils.rotatePoints = ({ x, y }, center, radAngle) => {
        return {
            x: (x - center.x) * Math.cos(radAngle) - (y - center.y) * Math.sin(radAngle) + center.x,
            y: (x - center.x) * Math.sin(radAngle) + (y - center.y) * Math.cos(radAngle) + center.y,
        };
    };
    MathUtils.toDegrees = (rad) => {
        return (180 * rad) / Math.PI;
    };
    /**
     * gets the rect draw coordinates such that, x and y are the center of the rectangle
     */
    MathUtils.getRectDrawCoordinates = (x, y, w, h) => {
        return { x: x - w / 2, y: y - h / 2 };
    };
})(MathUtils || (exports.MathUtils = MathUtils = {}));
var GenericUtils;
(function (GenericUtils) {
    /**
     * returns 5 random distinct characters
     */
    GenericUtils.getRandomChars = (excludeList) => {
        const randomChars = new Set();
        while (randomChars.size < 5) {
            const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            if (!excludeList.includes(randomChar)) {
                randomChars.add(randomChar);
            }
        }
        return [...randomChars];
    };
})(GenericUtils || (exports.GenericUtils = GenericUtils = {}));
var RenderUtils;
(function (RenderUtils) {
    RenderUtils.getGradient = (ctx, width) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        return gradient;
    };
})(RenderUtils || (exports.RenderUtils = RenderUtils = {}));

},{"../App/GameState":3,"../Shared/Constants":15}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interop = void 0;
var interop;
(function (interop) {
    let MessageType;
    (function (MessageType) {
        MessageType[MessageType["INIT"] = 0] = "INIT";
        MessageType[MessageType["GAME_START"] = 1] = "GAME_START";
        MessageType[MessageType["WORD"] = 2] = "WORD";
        MessageType[MessageType["DEATH"] = 3] = "DEATH";
        MessageType[MessageType["GAME_START_BROADCAST"] = 4] = "GAME_START_BROADCAST";
    })(MessageType = interop.MessageType || (interop.MessageType = {}));
})(interop || (exports.interop = interop = {}));

},{}],12:[function(require,module,exports){
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
        this.sendWord = (word, score, userName) => {
            this.isSocketOpen().then(() => {
                this.webSocketConnection.send(JSON.stringify({
                    messageType: Interop_1.interop.MessageType.WORD,
                    word,
                    userName,
                    score,
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
        // [word, score]
        this.waitForNextWordMessage = () => {
            return new Promise((resolve) => {
                const eventListener = (event) => {
                    const message = JSON.parse(event.data);
                    if (message.messageType === Interop_1.interop.MessageType.WORD) {
                        this.webSocketConnection.removeEventListener("message", eventListener);
                        resolve([message.word, message.score]);
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

},{"../Interop/Interop":11,"../Shared/Constants":15}],13:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRenderer = void 0;
const GameState_1 = require("../App/GameState");
const Constants_1 = require("../Shared/Constants");
const Utils = __importStar(require("./utils"));
/**
 * singleton class renders everything
 */
class GameRenderer {
    static getInstance() {
        if (!this.instance) {
            const gameCanvas = document.getElementById(Constants_1.HTMLElementIds.gameCanvas);
            this.instance = new GameRenderer(gameCanvas);
        }
        return this.instance;
    }
    get canvasDimensions() {
        return { w: this.gameCanvas.width, h: this.gameCanvas.height };
    }
    initializeCanvas() {
        this.setCanvasDimensions(window.innerWidth, window.innerHeight);
    }
    setCanvasDimensions(w, h) {
        this.gameCanvas.width = w * 0.9;
        this.gameCanvas.height = h * 0.9;
    }
    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.render = () => {
            const gameState = GameState_1.GameState.getInstance();
            this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            for (const drawableObject of gameState.drawableObjectsList) {
                drawableObject.render(this.ctx);
            }
            requestAnimationFrame(this.render);
        };
        this.windowResizeHandler = (w, h) => {
            this.setCanvasDimensions(w, h);
        };
        Utils.addWindowResizeHandler(this.windowResizeHandler);
        this.initializeCanvas();
        this.ctx = gameCanvas.getContext("2d");
    }
}
exports.GameRenderer = GameRenderer;

},{"../App/GameState":3,"../Shared/Constants":15,"./utils":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWindowResizeHandler = void 0;
const EventHandlerUtils_1 = require("../Shared/EventHandlerUtils");
const addWindowResizeHandler = (callbackFn) => {
    EventHandlerUtils_1.EventHandlerUtils.getInstance().addWindowResizeHandler((evt) => {
        const windowRef = evt.target;
        const { w, h } = { w: windowRef.innerWidth, h: windowRef.innerHeight };
        callbackFn(w, h);
    });
};
exports.addWindowResizeHandler = addWindowResizeHandler;

},{"../Shared/EventHandlerUtils":16}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratios = exports.HTMLElementIds = exports.WORD_ENTRY_TIME = exports.GAME_SERVER_URL = void 0;
exports.GAME_SERVER_URL = "http://48.217.80.100/word-roulette-service";
exports.WORD_ENTRY_TIME = 30;
var HTMLElementIds;
(function (HTMLElementIds) {
    HTMLElementIds["gameCanvas"] = "game-canvas";
    HTMLElementIds["dialog"] = "dialog";
    HTMLElementIds["wordInputTextBox"] = "word-input-text-box";
    HTMLElementIds["submitButton"] = "submit-button";
    HTMLElementIds["timerText"] = "timer-text";
    HTMLElementIds["gameContainer"] = "game-container";
    // dialog
    HTMLElementIds["previousWordSpan"] = "previous-word-span";
    HTMLElementIds["previousWordPrompt"] = "previous-word-prompt";
    HTMLElementIds["firstPreviousWordPrompt"] = "first-previous-word-prompt";
    HTMLElementIds["wordPromptDialogContent"] = "word-prompt-dialog-content";
    HTMLElementIds["infoDialogContent"] = "info-dialog-content";
    HTMLElementIds["infoDialogText"] = "info-dialog-text";
    HTMLElementIds["wordErrorOutput"] = "word-error-output";
    HTMLElementIds["randomCharsSpan"] = "random-chars-span";
    // main menu
    HTMLElementIds["mainMenuContainer"] = "main-menu-container";
    HTMLElementIds["mainMenu"] = "main-menu";
    HTMLElementIds["menuPage"] = "menu-page";
    HTMLElementIds["lobbyPage"] = "lobby-page";
    HTMLElementIds["createGameButton"] = "create-game-button";
    HTMLElementIds["joinGameButton"] = "join-game-button";
    HTMLElementIds["errorOutput"] = "error-output";
    // main menu inputs
    HTMLElementIds["userNameInput"] = "username-input";
    HTMLElementIds["roomInput"] = "room-input";
    // lobby
    HTMLElementIds["startGameButton"] = "start-game-button";
    HTMLElementIds["roomCodeSpan"] = "room-code-span";
    HTMLElementIds["playerList"] = "player-list";
    // score board
    HTMLElementIds["scoreBoard"] = "score-board";
    HTMLElementIds["scoreBoardList"] = "score-board-list";
})(HTMLElementIds || (exports.HTMLElementIds = HTMLElementIds = {}));
exports.Ratios = {
    windowToCanvas: 0.9,
    canvasToCircle: 0.7,
};

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlerUtils = void 0;
class EventHandlerUtils {
    static getInstance() {
        if (!this.instance) {
            this.instance = new EventHandlerUtils();
        }
        return this.instance;
    }
    constructor() {
        this.addWindowResizeHandler = (callbackFn) => {
            EventHandlerUtils.windowResizeHandlers.push(callbackFn);
        };
        this.windowResizeHandler = (evt) => {
            for (const callbackFn of EventHandlerUtils.windowResizeHandlers) {
                callbackFn(evt);
            }
        };
        EventHandlerUtils.windowResizeHandlers = [];
        window.onresize = this.windowResizeHandler;
    }
}
exports.EventHandlerUtils = EventHandlerUtils;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerUtils = void 0;
var ContainerUtils;
(function (ContainerUtils) {
    ContainerUtils.removeFromList = (list, index) => {
        return list.slice(0, index).concat(list.slice(index + 1));
    };
})(ContainerUtils || (exports.ContainerUtils = ContainerUtils = {}));

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App/App");
const EventHandlerUtils_1 = require("./Shared/EventHandlerUtils");
EventHandlerUtils_1.EventHandlerUtils.getInstance();
App_1.App.MainMenu();
// App.init()

},{"./App/App":2,"./Shared/EventHandlerUtils":16}]},{},[18]);
