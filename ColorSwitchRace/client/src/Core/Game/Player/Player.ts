import { GameConfig } from "../../../GameConfig";
import { IDrawable } from "../../GameRenderer/GameRenderer.types";
import { Color, Point, Velocity } from "../../SharedTypes";
import { GameState } from "../GameState/GameState";

export class Player implements IDrawable {
    private radius: number;
    private coordinates: Point;
    private velocity: Velocity;
    private color: Color;

    constructor() {
        this.radius = 20;
        this.coordinates = { x: 0, y: 0 };
        this.velocity = { dx: 0, dy: 0 };
        this.color = "red";
    }

    private checkCollisionWithBottom(): void {
        const { h: canvasHeight } = GameState.instance.getDimensions();
        const { y } = this.coordinates;

        if (y + this.radius > canvasHeight) {
            const gameOverEvent = new Event("game-over");
            window.dispatchEvent(gameOverEvent);
        }
    }

    public getCoordinates(): Point {
        return this.coordinates;
    }

    public setCoordinates(x: number, y: number) {
        this.coordinates.x = x;
        this.coordinates.y = y;
    }

    public setRadius(r: number) {
        this.radius = r;
    }

    public setColor(color: Color) {
        this.color = color;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.checkCollisionWithBottom();

        const { x, y } = this.coordinates;

        ctx.beginPath(); // clear the previous path from the canvas state machine
        ctx.fillStyle = this.color;
        ctx.arc(x, y, this.radius, 0, 180, false);
        ctx.fill();

        this.applyVelocity();

    }

    public getVelocity(): Velocity {
        return this.velocity;
    }

    public setVelocity(dy: number, dx?: number) {
        if (dx) {
            this.velocity.dx = dx;
        }
        this.velocity.dy = dy;
    }

    public applyVelocity() {
        // gravitational acceleration
        this.velocity.dy += GameConfig.G_FORCE;
        this.coordinates.y += this.velocity.dy;
    }
}
