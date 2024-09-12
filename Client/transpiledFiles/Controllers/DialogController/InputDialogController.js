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
                (_a = this.submitCallback) === null || _a === void 0 ? void 0 : _a.call(this, word);
                RTCManager_1.RTCManager.getInstance().sendWord(word, GameState_1.GameState.getInstance().getLocalPlayerName());
                this.wordInputTextBox.value = "";
                this.dispose();
            }
            catch (error) {
                this.showError(error.message);
            }
        });
        this.validateWord = (word) => __awaiter(this, void 0, void 0, function* () {
            if (word.length === 0) {
                throw new Error("Word cannot be empty");
            }
            const response = yield API_1.API.isWordValid(word);
            if (!response.isValid) {
                throw new Error("the given word is not valid english word");
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
