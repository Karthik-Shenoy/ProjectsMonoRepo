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
