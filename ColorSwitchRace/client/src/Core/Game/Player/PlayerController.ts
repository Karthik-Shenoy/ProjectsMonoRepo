import { IDrawable } from "../../GameRenderer/GameRenderer.types";
import { Point } from "../../SharedTypes";
import { Player } from "./Player";

export class PlayerController {
    private player: Player;

    constructor() {
        this.player = new Player();
        this.init();
    }

    private init() {
        window.addEventListener("keydown", (evt: KeyboardEvent) => {
            if (evt.key === " ") {
                this.onSpaceClicked();
            }
        });
    }

    private onSpaceClicked = () => {
        this.player.setVelocity(-4   /* dy */);
    };

    /**
     * delegate method to the Player member
     */
    public setCoordinates(coordinates: Point) {
        this.player.setCoordinates(coordinates.x, coordinates.y);
    }

    public getDrawable(): IDrawable {
        return this.player;
    }
}
