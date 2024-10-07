import { GameState } from "../App/GameState";
import { Dimensions } from "../Contracts/RendererContracts";
import { HTMLElementIds } from "../Shared/Constants";
import * as Utils from "./utils";

/**
 * singleton class renders everything
 */
export class GameRenderer {
    private static instance: GameRenderer;

    private ctx: CanvasRenderingContext2D;

    public static getInstance() {
        if (!this.instance) {
            const gameCanvas = document.getElementById(
                HTMLElementIds.gameCanvas
            ) as HTMLCanvasElement;
            this.instance = new GameRenderer(gameCanvas);
        }
        return this.instance;
    }

    public render = () => {
        const gameState = GameState.getInstance();

        this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        for (const drawableObject of gameState.drawableObjectsList) {
            drawableObject.render(this.ctx);
        }

        requestAnimationFrame(this.render);
    };

    public get canvasDimensions(): Dimensions {
        return { w: this.gameCanvas.width, h: this.gameCanvas.height };
    }

    private initializeCanvas() {
        this.setCanvasDimensions(window.innerWidth, window.innerHeight);
    }

    private windowResizeHandler = (w: number, h: number) => {
        this.setCanvasDimensions(w, h);
    };

    private setCanvasDimensions(w: number, h: number) {
        this.gameCanvas.width = w * 0.9;
        this.gameCanvas.height = h * 0.9;
    }

    private constructor(private gameCanvas: HTMLCanvasElement) {
        Utils.addWindowResizeHandler(this.windowResizeHandler);
        this.initializeCanvas();
        this.ctx = gameCanvas.getContext("2d")!;
    }
}
