import { GameState } from "../../App/GameState";
import { HTMLElementIds } from "../../Shared/Constants";
import { PlayerController } from "../PlayerController";

export class ScoreboardController {
    private scoreBoardListElement: HTMLDivElement | undefined;
    private scoreBoardDiv: HTMLDivElement;

    constructor() {
        this.scoreBoardDiv = document.getElementById(HTMLElementIds.scoreBoard) as HTMLDivElement;
        this.scoreBoardListElement = undefined;
    }

    public updateScoreBoard() {
        this.scoreBoardDiv.style.display = "block";
        if (this.scoreBoardListElement) {
            this.scoreBoardDiv.removeChild(this.scoreBoardListElement);
        }
        this.scoreBoardListElement = document.createElement("div");
        this.scoreBoardListElement.className = HTMLElementIds.scoreBoardList;

        GameState.getInstance()
            .getPlayerControllersList()
            .forEach((playerController) => {
                this.scoreBoardListElement?.appendChild(
                    this.getScoreBoardListElement(playerController)
                );
            });
        this.scoreBoardDiv.appendChild(this.scoreBoardListElement);
    }

    private getScoreBoardListElement = (playerController: PlayerController) => {
        const listElement = document.createElement("div");
        listElement.innerText = `${playerController.getUserName()} : ${playerController.getScore()}`;
        return listElement;
    };
}
