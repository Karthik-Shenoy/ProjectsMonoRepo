import { Animation } from "../Animation/Animation";
import { AnimationId } from "../Animation/AnimationConfig";
import { SharedConfig } from "../Config/SharedConfig";
import type {
    Coordinates,
    Dimensions,
    IDrawableObject,
    Velocity,
} from "../Contracts/RendererContracts";
import { GameState } from "../Core/GameState";
import type { IKeyboardInputHandler } from "../Core/InputsManager";
import { PlayerDirection, PlayerState, PlayerStateToAnimationMap } from "./PlayerUtils";

export class Player implements IDrawableObject, IKeyboardInputHandler {
    private coordinates: Coordinates;
    private dimensions: Dimensions;
    private velocity: Velocity;
    private state: PlayerState;
    private didStatChange: boolean;
    private playerDirection: PlayerDirection;

    private animation: Animation;

    constructor() {
        this.dimensions = SharedConfig.playerDimensions;
        this.velocity = { dx: 0, dy: 0 };
        this.state = PlayerState.Idle;

        this.coordinates = { x: 100, y: this.getPlayerHeightFromGround() };

        this.animation = new Animation(
            AnimationId.PlayerIdle,
            this.dimensions,
            this.coordinates,
            false /* flipImage */
        );
        this.didStatChange = false;

        this.playerDirection = PlayerDirection.L2R;
    }

    public handleKeyboardInput = (key: string) => {
        switch (key) {
            case " ": {
                if (this.state !== PlayerState.Jumping && this.velocity.dy === 0) {
                    this.velocity.dy -= 25;
                }
                break;
            }
            case "ArrowRight": {
                if (this.playerDirection == PlayerDirection.R2L) {
                    this.didStatChange = true;
                }
                this.velocity.dx = 4;
                this.playerDirection = PlayerDirection.L2R;
                break;
            }
            case "ArrowLeft": {
                if (this.playerDirection == PlayerDirection.L2R) {
                    this.didStatChange = true;
                }
                this.playerDirection = PlayerDirection.R2L;
                this.velocity.dx = -4;
                break;
            }
        }
    };

    public render(ctx: CanvasRenderingContext2D): void {
        this.animation.render(ctx);
    }

    public getUID = (): string => {
        return "";
    };

    public update(_delta: number) {
        this.velocity.dy += SharedConfig.Gravity;
        if (this.coordinates.y == this.getPlayerHeightFromGround()) {
            if (this.playerDirection == PlayerDirection.L2R) {
                this.velocity.dx = this.velocity.dx - 0.1 > 0 ? this.velocity.dx - 0.1 : 0;
            } else {
                this.velocity.dx = this.velocity.dx + 0.1 < 0 ? this.velocity.dx + 0.1 : 0;
            }
        }

        this.coordinates.x += this.velocity.dx;
        this.coordinates.y += this.velocity.dy;

        if (this.coordinates.y > this.getPlayerHeightFromGround()) {
            this.coordinates.y = this.getPlayerHeightFromGround();
            this.velocity.dy = 0;
        }

        this.updatePlayerState();

        if (this.didStatChange) {
            this.updateAnimation();
            this.didStatChange = false;
        }

    }

    private updatePlayerState() {
        const prevState = this.state;
        if (this.coordinates.y < this.getPlayerHeightFromGround()) {
            this.state = PlayerState.Jumping;
        } else if (this.velocity.dx != 0) {
            this.state = PlayerState.Running;
        } else if (this.coordinates.y == this.getPlayerHeightFromGround()) {
            this.state = PlayerState.Idle;
        }

        if (prevState != this.state) {
            this.didStatChange = true;
        }
    }

    private updateAnimation = () => {
        const shouldFlipImage = this.playerDirection == PlayerDirection.L2R ? false : true;
        this.animation.update(
            this.coordinates,
            PlayerStateToAnimationMap[this.state],
            shouldFlipImage
        );
    };

    private getPlayerHeightFromGround() {
        const groundHeight =
            GameState.instance.getCanvasDims().h - this.dimensions.h - SharedConfig.GroundHeight;
        return groundHeight;
    }
}
