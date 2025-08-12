import type { IDrawableObject, IRenderDelegate } from "../Contracts/RendererContracts";
import { GameState } from "../Core/GameState";
import { GroundManager } from "../Core/GroundManager";
import { ParallaxManager } from "../Core/ParallaxManager";

export class GameRenderer {
    private static _instance: GameRenderer | undefined;
    private lastTick: number;
    private objectsToDraw: IDrawableObject[];
    private renderDelegates: IRenderDelegate[]

    private constructor(private canvas: HTMLCanvasElement) {
        this.lastTick = performance.now();
        this.objectsToDraw = [];
        this.renderDelegates = [];
    }

    private getObjectsToDraw(): IDrawableObject[] {
        return this.objectsToDraw;
    }

    public addObjectsToDraw(obj: IDrawableObject) {
        this.objectsToDraw.push(obj);
    }

    public addRenderDelegate(delegate: IRenderDelegate) {
        this.renderDelegates.push(delegate);
    }

    public removeObjectsToDraw(uid: string) {
        this.objectsToDraw = this.objectsToDraw.filter((obj) => obj.getUID() !== uid);
    }

    public static initAndInstance(canvas: HTMLCanvasElement) {
        if (!this._instance) {
            this._instance = new GameRenderer(canvas);
        }
        return this._instance;
    }

    public static getInstance() {
        if (!this._instance) {
            throw new Error("GameRenderer instance not initialized. Call initAndInstance(canvas) first.");
        }
        return this._instance;
    }

    public renderLoop = () => {
        const ctx = this.canvas.getContext("2d")!;
        const delta = performance.now() - this.lastTick;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        GameState.instance.getTickHandlers().forEach((handler) => {
            handler.update(delta);
        });

        this.renderDelegates.forEach((delegate) => {
            delegate.update(delta);
        });

        ParallaxManager.render(ctx);

        this.getObjectsToDraw().forEach((obj) => {
            obj.update(delta);
            obj.render(ctx);
        });

        GroundManager.render(ctx);

        this.renderDelegates.forEach((delegate) => {
            delegate.render(ctx);
        });

        this.lastTick = performance.now();
        requestAnimationFrame(this.renderLoop);
    };
}
