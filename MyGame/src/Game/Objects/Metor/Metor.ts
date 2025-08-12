import { Animation } from "../../Animation/Animation";
import { AnimationId } from "../../Animation/AnimationConfig";
import { SharedConfig } from "../../Config/SharedConfig";

import type {
    Coordinates,
    Dimensions,
    IDrawableObject,
    Velocity,
} from "../../Contracts/RendererContracts";
import { GameState } from "../../Core/GameState";
import { rotateAboutAnotherPoint } from "../../Utils/Utils";

enum MeteorState {
    Falling = "Falling",
    Exploding = "Exploding",
}

export class Meteor implements IDrawableObject {
    private coordinates: Coordinates; // World coordinates (top-left)
    private dimensions: Dimensions;
    private velocity: Velocity;
    private angle: number; // Angle in radians for rotation
    private state: MeteorState; // Current state of the meteor

    private id: string; // Unique identifier for the meteor

    private animation: Animation;

    constructor(initialAngle: number, initialX: number) {
        const speed = 8; // Example speed
        this.velocity = {
            dx: speed * Math.cos(initialAngle),
            dy: speed * Math.sin(initialAngle),
        };
        this.dimensions = { w: 120, h: 90 }; // Example dimensions
        // Meteors start from the top, just outside the visible screen area typically
        this.coordinates = { x: initialX, y: -this.dimensions.h };
        this.angle = initialAngle;
        this.state = MeteorState.Falling;

        // The Animation object is given coordinates relative to the Meteor's own origin (0,0)
        // if it's drawn centered. Or, if Animation draws from its top-left,
        // these coordinates should be (-width/2, -height/2) so it appears centered after rotation.
        // Let's assume Animation's constructor sets up its drawing relative to the coords it's given.
        // For centered drawing after rotation, the animation itself should be "placed" at (-w/2, -h/2).
        this.animation = new Animation(
            AnimationId.Meteor,
            this.dimensions,
            // These are the coordinates the Animation object will use when its render() is called.
            // In our render method, we translate the canvas to the meteor's center, then rotate.
            // So the animation should be drawn at (-w/2, -h/2) in that new rotated context.
            { x: -this.dimensions.w / 2, y: -this.dimensions.h / 2 }
        );

        this.id = `meteor-${performance.now()}`;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if( this.state === MeteorState.Exploding ) {
            this.animation.render(ctx);
            return;
        }
        ctx.save();
        // Translate to the center of the meteor for rotation
        ctx.translate(
            this.coordinates.x + this.dimensions.w / 2,
            this.coordinates.y + this.dimensions.h / 2
        );
        // Rotate the context
        ctx.rotate(this.angle);
        // The animation was constructed with coordinates {-w/2, -h/2}.
        // It will render itself using these coordinates relative to the current
        // transformed (translated and rotated) canvas origin.
        this.animation.render(ctx);
        ctx.restore();
    }

    public getUID = (): string => {
        return this.id;
    };

    public update(_delta: number): void {
        if(this.state === MeteorState.Exploding) {
            this.velocity.dx = 0;
            this.velocity.dy = 0;
            return;
        }
        this.coordinates.x += this.velocity.dx;
        this.coordinates.y += this.velocity.dy;
        // The animation object itself doesn't need its world coordinates updated here,
        // as its drawing position is relative to the meteor's center, handled by the canvas transform.        
    }

    public setExploding(): void {
        if(this.state !== MeteorState.Exploding) {
            this.state = MeteorState.Exploding;
            this.dimensions = {w: 170, h: 190}; // Change dimensions for explosion effect
            // Optionally, you could trigger an explosion animation here
            // or change the animation to an explosion frame.
            const coordinatesOnGround = {
                x: this.coordinates.x + this.dimensions.w / 2,
                y: GameState.instance.getCanvasDims().h - SharedConfig.GroundHeight - this.dimensions.h,
            }
            this.animation.update(coordinatesOnGround, AnimationId.MeteorExplosion, false, this.dimensions);
        }
    }

    public getCoordinates(): Coordinates {
        return this.coordinates;
    }

    public getDimensions(): Dimensions {
        return this.dimensions;
    }

    public isOffScreen(canvasHeight: number, canvasWidth: number): boolean {
        // check if any corners of the meteor are off-screen or collides with the ground
        return (
            this.coordinates.y > canvasHeight ||
            this.coordinates.x < -this.dimensions.w ||
            this.coordinates.x > canvasWidth
        );
    }

    public isCollidingWithGround(canvasHeight: number): boolean {
        const topLeft = this.coordinates;
        // Apply rotation to all corners about the meteor's center
        const center = {
            x: this.coordinates.x + this.dimensions.w / 2,
            y: this.coordinates.y + this.dimensions.h / 2,
        };
        const topRight = rotateAboutAnotherPoint(
            { x: this.coordinates.x + this.dimensions.w, y: this.coordinates.y },
            center,
            this.angle
        );
        const bottomLeft = rotateAboutAnotherPoint(
            { x: this.coordinates.x, y: this.coordinates.y + this.dimensions.h },
            center,
            this.angle
        );
        const bottomRight = rotateAboutAnotherPoint(
            {
                x: this.coordinates.x + this.dimensions.w,
                y: this.coordinates.y + this.dimensions.h,
            },
            center,
            this.angle
        );
        const rotatedTopLeft = rotateAboutAnotherPoint(topLeft, center, this.angle);

        const yCoords = [rotatedTopLeft.y, topRight.y, bottomLeft.y, bottomRight.y];

        const groundHeight = canvasHeight - SharedConfig.GroundHeight;

        for (const y of yCoords) {
            if (y > groundHeight) {
                return true; // At least one corner is below the ground
            }
        }
        return false; // All corners are above the ground
    }

    public isCollidingWithRect(
        coordinates: Coordinates,
        dimensions: Dimensions
    ): boolean {
        // Check if the meteor's bounding box intersects with the given rectangle
        const meteorLeft = this.coordinates.x;
        const meteorRight = this.coordinates.x + this.dimensions.w;
        const meteorTop = this.coordinates.y;
        const meteorBottom = this.coordinates.y + this.dimensions.h;

        const rectLeft = coordinates.x;
        const rectRight = coordinates.x + dimensions.w;
        const rectTop = coordinates.y;
        const rectBottom = coordinates.y + dimensions.h;

        return (
            meteorLeft < rectRight &&
            meteorRight > rectLeft &&
            meteorTop < rectBottom &&
            meteorBottom > rectTop
        );
    }
}
