import type { Dimensions, ITickHandler } from "../Contracts/RendererContracts";

/**
 * Singleton object with `static-lifetime`
 */
export class GameState {
    private static _instance: GameState | undefined = undefined;
    private canvasDims: Dimensions;

    private tickHandlers: ITickHandler[];

    private constructor() {
        this.tickHandlers = [];
        this.canvasDims = { w: 0, h: 0 };
    }

    public addTickHandler(handler: ITickHandler) {
        this.tickHandlers.push(handler);
    }

    public getTickHandlers(): readonly ITickHandler[] {
        return this.tickHandlers;
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new GameState();
        }
        return this._instance;
    }

    public updateCanvasDimensions = (canvas: HTMLCanvasElement) => {
        this.canvasDims = { w: canvas.width, h: canvas.height };
    };

    public getCanvasDims = () => {
        return this.canvasDims;
    };
}
