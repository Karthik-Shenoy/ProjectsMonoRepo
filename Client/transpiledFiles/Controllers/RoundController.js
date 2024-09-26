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
            this.scoreBoardController.updateScoreBoard();
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
