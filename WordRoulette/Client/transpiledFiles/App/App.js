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
