import { GameState } from "../Game/GameState/GameState";


export class GameRenderer {
    private static s_instance: GameRenderer | undefined = undefined;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gameState: GameState;

    public static getInstance() {
        if (!this.s_instance) {
            this.s_instance = new GameRenderer();
        }
        return this.s_instance;
    }

    private constructor() {
        const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
        if (!canvas) {
            throw Error(
                "GameRenderer.Constructor: SynchronizationError! Could not get the canvas element"
            );
        }
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        window.addEventListener("resize", this.init);
        this.gameState = GameState.instance;
        this.init();
    }

    private init = () => {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
    };

    private clearCanvas(ctx: CanvasRenderingContext2D) {
        const [screenWidth, screenHeight] = [this.canvas.width, this.canvas.height];
        ctx.fillStyle = "black";
        ctx?.fillRect(0, 0, screenWidth, screenHeight);
    }

    public render = () => {
        if (!this.ctx) {
            return;
        }

        this.clearCanvas(this.ctx);

        for (const object of this.gameState.getDrawableObjects()) {
            object.draw(this.ctx);
        }

        requestAnimationFrame(this.render);
    };
}
