import { InfoDialogController } from "../Controllers/DialogController/InfoDialogController";
import { MainPageController } from "../Controllers/MainMenuController/MainMenuController";
import { PlayerController } from "../Controllers/PlayerController";
import { RoundController } from "../Controllers/RoundController";
import { GameRenderer } from "../Renderer/GameRenderer";
import { HTMLElementIds } from "../Shared/Constants";
import { GameState } from "./GameState";

export namespace App {
    
    let isAppRunning = false;

    export const MainMenu = () => {
        // hide the game instance
        const gameContainer = document.getElementById(HTMLElementIds.gameContainer) as HTMLDivElement;
        gameContainer.style.display = "none";

        initGame("");

        new MainPageController(() => {
            gameContainer.style.display = "flex"
        });

    }

    export const initGame = (localPlayerUsername: string)=> {
        if (!isAppRunning) {
            isAppRunning = true;
            const roundController = new RoundController();
            GameState.init(roundController, localPlayerUsername);
        }
    }

    
}
