import type { Coordinates, Dimensions } from "../Contracts/RendererContracts";
import { AnimationConfigs, type AnimationId } from "./AnimationConfig";
import { getNumFrames } from "./AnimationUtils";
import { SpriteSheetLoader } from "./SpriteLoader";

/**
 * Animation is just a collection of frames from a sprite sheet.
 * It can be used to animate a sprite by cycling through the frames.
 *
 * Every Sprite in the game is an animation.
 * - if its a still image, it has only one frame.
 * - if its a moving image, it has multiple frames.
 */
export class Animation {
    private animationId: AnimationId;
    private currentFrameIndex: number;
    private lastFrameTime: number;
    private dimensions: Dimensions;
    private coordinates: Coordinates;
    private image: HTMLImageElement;

    constructor(
        AnimationId: AnimationId,
        dimensions: Dimensions,
        coordinates: Coordinates,
        private flipImage: boolean = false
    ) {
        this.animationId = AnimationId;
        const animationConfig = AnimationConfigs[this.animationId];
        this.currentFrameIndex = 0;
        this.lastFrameTime = performance.now();

        this.image = SpriteSheetLoader.getImage(animationConfig.imgSrc);

        this.dimensions = dimensions;
        this.coordinates = coordinates;
    }

    private tick() {
        const animationConfig = AnimationConfigs[this.animationId];
        const numFrames = getNumFrames(animationConfig.startIndices, animationConfig.endIndices);
        const now = performance.now();
        if (now - this.lastFrameTime >= animationConfig.durationMs) {
            if (!animationConfig.repeatInfinite && this.currentFrameIndex >= numFrames - 1) {
                this.currentFrameIndex = numFrames - 1; // Stop at the last frame
            } else {
                this.currentFrameIndex = (this.currentFrameIndex + 1) % numFrames;
            }
            this.lastFrameTime = now;
        }
    }

    public update(
        newCoordinates: Coordinates,
        animationId: AnimationId,
        flipImage?: boolean,
        dimensions?: Dimensions
    ) {
        this.coordinates = newCoordinates;
        this.animationId = animationId;
        this.image = SpriteSheetLoader.getImage(AnimationConfigs[this.animationId].imgSrc);
        this.currentFrameIndex = 0; // Reset frame index on animation change
        if (flipImage !== undefined) {
            this.flipImage = flipImage;
        }

        if (dimensions !== undefined) {
            this.dimensions = dimensions;
        }
    }

    public isAnimationFinished(): boolean {
        const animationConfig = AnimationConfigs[this.animationId];
        const numFrames = getNumFrames(animationConfig.startIndices, animationConfig.endIndices);
        return !animationConfig.repeatInfinite && this.currentFrameIndex >= numFrames - 1;
    }

    public async render(ctx: CanvasRenderingContext2D) {
        const animationConfig = AnimationConfigs[this.animationId];

        const { row, col } = animationConfig.startIndices;
        const { w, h } = animationConfig.frameDims;

        const [sx, sy] = [(col + this.currentFrameIndex) * w, row];

        if (this.flipImage) {
            ctx.save(); // Save the current state
            ctx.translate(this.coordinates.x, this.coordinates.y); // Move origin to the right edge
            ctx.scale(-1, 1); // Flip horizontally

            ctx.drawImage(
                this.image,
                sx,
                sy,
                w,
                h,
                -this.dimensions.w, // This offsets the image to the right position after translation
                0,
                this.dimensions.w,
                this.dimensions.h
            ); // Draw image flipped
            ctx.restore();
        } else {
            ctx.drawImage(
                this.image,
                sx,
                sy,
                w,
                h,
                this.coordinates.x,
                this.coordinates.y,
                this.dimensions.w,
                this.dimensions.h
            );
        }

        this.tick();
    }
}
