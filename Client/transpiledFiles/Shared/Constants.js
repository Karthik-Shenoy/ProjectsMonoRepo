"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratios = exports.HTMLElementIds = exports.WORD_ENTRY_TIME = exports.GAME_SERVER_URL = void 0;
exports.GAME_SERVER_URL = "https://48.217.80.100/word-roulette-service";
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
