import { IDrawable, Point } from "../Contracts/RendererContracts";
import { RTCManager } from "../RTC/RTCManager";
import { InfoDialogController } from "./DialogController/InfoDialogController";
import { InputDialogController } from "./DialogController/InputDialogController";
import { MathUtils, RenderUtils } from "./Utils";

enum Highlight {
    "Turn",
    "DeathHighlight",
    "None",
}

export class PlayerController implements IDrawable {
    private coordinates: Point;
    private isAlive: boolean;
    private isLocalPlayer: boolean;
    private highlightType: Highlight;
    private username: string;
    private angle: number;

    private score: number;

    constructor() {
        this.coordinates = { x: 0, y: 0 };
        this.isAlive = true;
        this.isLocalPlayer = true;
        this.highlightType = Highlight.None;
        this.username = "";
        this.angle = 0;
        this.score = 0;
    }
    // position self
    public set position(newCoordinates: Point) {
        this.coordinates.x = newCoordinates.x;
        this.coordinates.y = newCoordinates.y;
    }

    public set angleOfRotation(angle: number) {
        this.angle = angle >= Math.PI ? Math.PI - angle : angle;
    }

    public setUserName = (username: string) => {
        this.username = username;
    };

    public get isLocal() {
        return this.isLocalPlayer;
    }

    // turn->takeInput
    // highlight
    public highlight = () => {
        this.highlightType = Highlight.DeathHighlight;
    };
    public removeHighlight = () => {
        this.highlightType = Highlight.None;
    };
    public highlightTurn = () => {
        this.highlightType = Highlight.Turn;
    };

    // render
    public render = (ctx: CanvasRenderingContext2D) => {
        if (!this.isAlive) {
            return;
        }
        const { x, y } = this.coordinates;
        // set state machine
        ctx.fillStyle = "red";

        // draw
        const { x: rectX, y: rectY } = MathUtils.getRectDrawCoordinates(x, y, 20, 20);
        ctx.fillRect(rectX, rectY, 20, 20);

        ctx.fillText(this.username, rectX, rectY + 60);

        if (this.highlightType !== Highlight.None) {
            ctx.lineWidth = 2;

            if (this.highlightType === Highlight.Turn) {
                ctx.strokeStyle = "green";
            } else {
                ctx.strokeStyle = "red";
            }

            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.stroke();
        }

        //reset state machine
    };

    public setRemotePlayer = () => {
        this.isLocalPlayer = false;
    };

    public setLocalPlayer = () => {
        this.isLocalPlayer = true;
    };

    public getUserName(): string {
        return this.username;
    }

    public getScore(): number {
        return this.score;
    }

    public getPlayerInput = (previousWord: string, lastDeadPlayerName: string): Promise<string> => {
        if (this.isLocalPlayer) {
            return new Promise((resolve, _reject) => {
                const dialogController = new InputDialogController(previousWord);
                dialogController.setOnSubmitCallback((text: string, score: number) => {
                    resolve(text);
                    this.score += score;
                });
            });
        }
        return new Promise((resolve) => {
            let infoDialog: InfoDialogController | null = null;

            if (!previousWord) {
                if (lastDeadPlayerName) {
                    infoDialog = new InfoDialogController(
                        `${lastDeadPlayerName} killed themselves \u{1F602}. Waiting for ${this.username} to enter the word`
                    );
                } else {
                    infoDialog = new InfoDialogController(
                        `Waiting for ${this.username} to enter the word`
                    );
                }
            } else {
                if (lastDeadPlayerName) {
                    infoDialog = new InfoDialogController(
                        `${lastDeadPlayerName} killed himself \u{1F602}. Last word was ${previousWord}. Waiting for ${this.username} to enter the word`
                    );
                } else {
                    infoDialog = new InfoDialogController(
                        `Last word was ${previousWord}. Waiting for ${this.username} to enter the word`
                    );
                }
            }

            RTCManager.getInstance()
                .waitForNextWordMessage()
                .then(([word, score]) => {
                    resolve(word);
                    this.score += score;
                    infoDialog?.dispose();
                });
        });
    };

    public kill() {
        this.isAlive = false;
    }
}
