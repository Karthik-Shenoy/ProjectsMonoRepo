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
