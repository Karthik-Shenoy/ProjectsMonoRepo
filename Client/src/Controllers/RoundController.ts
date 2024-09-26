import { GameState } from "../App/GameState";
import { Point } from "../Contracts/RendererContracts";
import { EventHandlerUtils } from "../Shared/EventHandlerUtils";
import { MathUtils } from "./Utils";
import { PlayerController } from "./PlayerController";
import { ContainerUtils } from "../Shared/Utils";
import { RTCMessage, RTCMessageSubscriber } from "../RTC/RTCTypes";
import { interop } from "../Interop/Interop";
import { RTCManager } from "../RTC/RTCManager";
import { InfoDialogController } from "./DialogController/InfoDialogController";
import { ScoreboardController } from "./ScoreboardController/ScoreBoardController";
import { TOTAL_GAME_TIME } from "../Shared/Constants";

/**
 * Singleton Controller to control the rounds
 */
export class RoundController implements RTCMessageSubscriber {
    private currentPlayerIndex: number;
    private playersList: PlayerController[];
    private previousWord: string;
    private lastDeadPlayerName: string;
    private scoreBoardController: ScoreboardController;
    private gameTimerExpired: boolean;

    constructor() {
        this.playersList = [];
        this.currentPlayerIndex = 0;
        EventHandlerUtils.getInstance().addWindowResizeHandler(this.positionPlayers);
        this.previousWord = "";
        this.lastDeadPlayerName = "";

        this.scoreBoardController = new ScoreboardController();
        this.gameTimerExpired = false;
        setTimeout(() => {
            this.gameTimerExpired = true;
        }, TOTAL_GAME_TIME);
    }

    public addPlayer(playerController: PlayerController) {
        this.playersList.push(playerController);
    }

    public getPlayerAtPosition(index: number): PlayerController {
        return this.playersList[index];
    }

    public startRound = async () => {
        if (this.hasGameEnded()) {
            // improve code
            const winner =
                this.playersList.length > 1
                    ? this.playersList.reduce((prev, curr) =>
                          prev.getScore() > curr.getScore() ? prev : curr
                      )
                    : this.playersList[0];
            if(this.playersList.length > 1)
            {
                new InfoDialogController(`Time's up, ${winner.getUserName()} wins! with ${winner.getScore()} points\u{1F929} `);
            }
            else 
            {
                new InfoDialogController(`Game Over ${winner.getUserName()} wins! \u{1F929}`);
            }
                
            return;
        }

        this.scoreBoardController.updateScoreBoard();

        this.positionPlayers();
        this.playersList[this.currentPlayerIndex].highlightTurn();
        const inputText = await this.getInput(this.previousWord, this.lastDeadPlayerName);
        this.previousWord = inputText;

        const offset = this.validateInput(inputText);

        await this.highlightPlayers(inputText.length);

        this.playersList[this.currentPlayerIndex].removeHighlight();

        const newPlayerIndex = (this.currentPlayerIndex + offset - 1) % this.playersList.length;

        console.log(
            "new player index",
            newPlayerIndex,
            " current player index",
            this.currentPlayerIndex
        );

        if (this.currentPlayerIndex === newPlayerIndex) {
            this.playersList[this.currentPlayerIndex].kill();
            this.lastDeadPlayerName = this.playersList[this.currentPlayerIndex].getUserName();
            this.playersList = ContainerUtils.removeFromList(
                this.playersList,
                this.currentPlayerIndex
            );
            this.setCurrPlayerIndex(this.currentPlayerIndex % this.playersList.length);
        } else {
            this.setCurrPlayerIndex(newPlayerIndex);
        }
        setTimeout(this.startRound, 0);
    };

    public handleRTCMessage(message: RTCMessage) {
        switch (message.messageType) {
            case interop.MessageType.DEATH:
                this.playersList[this.currentPlayerIndex].kill();
                this.playersList = ContainerUtils.removeFromList(
                    this.playersList,
                    this.currentPlayerIndex
                );
                this.setCurrPlayerIndex(this.currentPlayerIndex % this.playersList.length);
                break;
        }
    }

    public getPlayerControllersList() {
        return this.playersList;
    }

    private hasGameEnded(): boolean {
        return this.playersList.length === 1 || this.gameTimerExpired;
    }

    private setCurrPlayerIndex(index: number) {
        this.currentPlayerIndex = index;
    }

    // has possibility of causing deadlock if used in game state
    private positionPlayers = () => {
        // based on the list length we need x and y on the circle
        const radius = MathUtils.getPlayersCircleRadius();
        const canvasCenter = MathUtils.getCanvasCenter();
        const initPosition: Point = { x: canvasCenter.x + radius, y: canvasCenter.y };
        const dRadAngle = (2 * Math.PI) / this.playersList.length;

        console.log("list length", this.playersList.length);

        this.playersList.forEach((playerController, index) => {
            const { x, y } = MathUtils.rotatePoints(initPosition, canvasCenter, index * dRadAngle);
            playerController.position = { x, y };
            playerController.angleOfRotation = index * dRadAngle;
        });
    };

    private highlightPlayers = (wordLength: number) =>
        new Promise<void>((resolve) => {
            let cnt = 0;
            if (wordLength === 0) {
                resolve();
            }

            let currIndex = this.currentPlayerIndex;
            while (cnt < wordLength) {
                const highlight = (highlightIndex: number, done: boolean) => {
                    if (highlightIndex - 1 < 0) {
                        this.playersList[this.playersList.length - 1].removeHighlight();
                    } else {
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

    private validateInput = (input: string) => {
        if (input.length <= 0) {
            return 1;
        }
        return input.length;
    };

    private getInput = async (previousWord: string, lastDeadPlayerName: string) => {
        const playerInput = await this.playersList[this.currentPlayerIndex].getPlayerInput(
            previousWord,
            lastDeadPlayerName
        );
        return playerInput;
    };
}
