import { AssetIds, AssetUrls } from "../Animation/AnimationConfig";
import { SpriteSheetLoader } from "../Animation/SpriteLoader";
import { GameState } from "./GameState";

export class ParallaxManager {
    public static render(ctx: CanvasRenderingContext2D) {
        const imgUrl = AssetUrls[AssetIds.Background];
        const backgroundImage = SpriteSheetLoader.getImage(imgUrl);

        const { w, h } = GameState.instance.getCanvasDims();
        ctx.drawImage(backgroundImage, 0, 0, 1993, 1045, 0, 0, w, h);
    }
}
