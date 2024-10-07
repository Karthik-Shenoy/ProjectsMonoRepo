"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogController = void 0;
const GameState_1 = require("../../App/GameState");
const RTCManager_1 = require("../../RTC/RTCManager");
const Constants_1 = require("../../Shared/Constants");
class DialogController {
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
        this.submitHandler = () => {
            var _a;
            (_a = this.submitCallback) === null || _a === void 0 ? void 0 : _a.call(this, this.wordInputTextBox.value);
            RTCManager_1.RTCManager.getInstance().sendWord(this.wordInputTextBox.value, GameState_1.GameState.getInstance().getLocalPlayerName());
            this.wordInputTextBox.value = "";
            this.dispose();
        };
        this.createTimer = () => {
            const timerText = document.getElementById(Constants_1.HTMLElementIds.timerText);
            const updateTime = (time) => {
                timerText.innerText = time.toString();
                if (time >= 10) {
                    this.submitHandler();
                    return;
                }
                this.setTimeoutHandle = setTimeout(updateTime, 1000, time + 1);
            };
            this.setTimeoutHandle = setTimeout(updateTime, 0, 0);
        };
        this.dialogElement = document.getElementById(Constants_1.HTMLElementIds.inputDialog);
        this.dialogElement.showModal();
        this.wordInputTextBox = document.getElementById(Constants_1.HTMLElementIds.wordInputTextBox);
        this.wordInputTextBox.focus();
        this.submitButton = document.getElementById(Constants_1.HTMLElementIds.submitButton);
        this.submitButton.onclick = () => {
            this.submitHandler();
        };
        this.updatePreviousWordPrompt();
        this.createTimer();
    }
    updatePreviousWordPrompt() {
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
}
exports.DialogController = DialogController;
