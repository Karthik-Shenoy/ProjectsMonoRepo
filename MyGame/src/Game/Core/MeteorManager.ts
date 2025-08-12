import { Meteor } from "../Objects/Metor/Metor";
import type { Coordinates, Dimensions, IDrawableObject, IRenderDelegate } from "../Contracts/RendererContracts";

export class MeteorManager implements IRenderDelegate {
    private meteors: Meteor[];
    private canvasWidth: number;
    private canvasHeight: number;
    private spawnInterval: number; // milliseconds
    private lastSpawnTime: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.meteors = [new Meteor(Math.PI / 4, 0)]; // Start with one meteor for testing
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.spawnInterval = 1000; // Spawn a new meteor every 2 seconds, for example
        this.lastSpawnTime = 0;
    }

    public update(deltaTime: number): void {
        this.lastSpawnTime += deltaTime;

        // Attempt to spawn a new meteor if interval has passed
        if (this.lastSpawnTime > this.spawnInterval) {
            this.spawnMeteor();
            this.lastSpawnTime = 0; // Reset timer
        }

        // Update existing meteors
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            meteor.update(deltaTime);

            // Remove meteors that are off-screen
            if (meteor.isOffScreen(this.canvasHeight, this.canvasWidth)) {
                this.meteors.splice(i, 1);
            } else if (meteor.isCollidingWithGround(this.canvasHeight)) {
                // Handle collision with ground, e.g., change state to exploding
                meteor.setExploding();
            } 
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (const meteor of this.meteors) {
            meteor.render(ctx);
        }
    }

    private spawnMeteor(): void {
        // Randomize starting X position along the top edge (or slightly off-screen)
        const initialX = Math.random() * this.canvasWidth;

        // Randomize angle - e.g., between 45 and 135 degrees (PI/4 to 3PI/4 radians)
        // to make them fall generally downwards
        const minAngle = Math.PI / 4; // 45 degrees
        const maxAngle = (3 * Math.PI) / 4; // 135 degrees
        const angle = Math.random() * (maxAngle - minAngle) + minAngle;

        const newMeteor = new Meteor(angle, initialX);
        this.meteors.push(newMeteor);
    }

    public isCollidingWithMeteors = (coordinates: Coordinates, dimensions: Dimensions) => {
        this.meteors.forEach((meteor) => {
            if (meteor.isCollidingWithRect(coordinates, dimensions)) {
                return true;
            }
        });
        return false;
    }

    public getDrawableObjects(): IDrawableObject[] {
        return this.meteors;
    }

    public getMeteors(): Meteor[] {
        return this.meteors;
    }
}
