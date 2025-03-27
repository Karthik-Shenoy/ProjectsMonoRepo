import { IDrawable } from "../../GameRenderer/GameRenderer.types";
import { Dimensions } from "../../SharedTypes";
import { PlayerController } from "../Player";

// Life time is equivalent to a game's lifetime
export class GameState {
    private static s_instance: GameState;

    private dimensions: Dimensions | undefined;
    private localPlayer: PlayerController | undefined;
    private objectsToDraw: IDrawable[];

    public static get instance() {
        if (!this.s_instance) {
            this.s_instance = new GameState();
        }
        return this.s_instance;
    }

    private constructor() {
        this.localPlayer = new PlayerController();
        this.objectsToDraw = [];
        this.objectsToDraw.push(this.localPlayer.getDrawable());
        window.addEventListener("resize", () => {
            this.init();
        });
        this.init();
    }

    private init() {
        if (!this.localPlayer) {
            throw Error(
                "GameState.init: InitializationError! localPlayer was not initialized properly"
            );
        }
        const [w, h] = [window.innerWidth, window.innerHeight];
        this.dimensions = {
            w,
            h,
        };
        this.localPlayer.setCoordinates({
            x: w / 2,
            y: h - 400,
        });
    }

    public getDrawableObjects(): IDrawable[] {
        return this.objectsToDraw;
    }

    public getDimensions(): Dimensions {
        if (!this.dimensions) {
            throw Error(
                "GameState.getDimensions: SynchronizationError! Dimensions were not initialized properly"
            );
        }
        return this.dimensions;
    }
}
