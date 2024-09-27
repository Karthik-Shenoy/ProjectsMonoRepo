export const GAME_SERVER_URL = "http://48.217.80.100/word-roulette-service";

export const WORD_ENTRY_TIME = 30;

export enum HTMLElementIds {
    gameCanvas = "game-canvas",
    dialog = "dialog",
    wordInputTextBox = "word-input-text-box",
    submitButton = "submit-button",
    timerText = "timer-text",
    gameContainer = "game-container",

    // dialog
    previousWordSpan = "previous-word-span",
    previousWordPrompt = "previous-word-prompt",
    firstPreviousWordPrompt = "first-previous-word-prompt",
    wordPromptDialogContent = "word-prompt-dialog-content",
    infoDialogContent = "info-dialog-content",
    infoDialogText = "info-dialog-text",
    wordErrorOutput = "word-error-output",
    randomCharsSpan = "random-chars-span",


    // main menu
    mainMenuContainer = "main-menu-container",
    mainMenu = "main-menu",
    menuPage = "menu-page",
    lobbyPage = "lobby-page",
    createGameButton = "create-game-button",
    joinGameButton = "join-game-button",
    errorOutput = "error-output",

    // main menu inputs
    userNameInput = "username-input",
    roomInput = "room-input",

    // lobby
    startGameButton = "start-game-button",
    roomCodeSpan = "room-code-span",
    playerList = "player-list",

    // score board
    scoreBoard = "score-board",
    scoreBoardList = "score-board-list",
}

export const Ratios = {
    windowToCanvas: 0.9,
    canvasToCircle: 0.7,
};
