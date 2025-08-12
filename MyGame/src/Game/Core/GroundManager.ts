import { TilesConfigs } from "../Animation/AnimationConfig";
import { SpriteSheetLoader } from "../Animation/SpriteLoader";
import { SharedConfig } from "../Config/SharedConfig";
import { GameState } from "./GameState";

export class GroundManager {
    public static render(ctx: CanvasRenderingContext2D) {
        const config = TilesConfigs.Ground;
        const groundImg = SpriteSheetLoader.getImage(config.imgSrc);
        const { w: canvasW, h: canvasH } = GameState.instance.getCanvasDims();

        const numTiles = Math.ceil(canvasW / config.dims.w);
        const drawDimensions = {
            w: 128,
            h: SharedConfig.GroundHeight, // Fixed height for ground tiles
        };

        for (let i = 0; i < numTiles; i++) {
            ctx.drawImage(
                groundImg,
                config.coords.x,
                config.coords.y,
                config.dims.w,
                config.dims.h,
                i * config.dims.w,
                canvasH - drawDimensions.h,
                drawDimensions.w,
                drawDimensions.h
            );
        }
    }
}
