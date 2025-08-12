import {
    AnimationConfigs,
    AnimationId,
    AssetIds,
    AssetUrls,
    TileId,
    TilesConfigs,
} from "./AnimationConfig";

export class SpriteSheetLoader {
    private static spriteSheetCache: Map<string, HTMLImageElement> = new Map();

    public static loadAllSpriteSheets = async () => {
        const promises = [];
        try {
            for (const id of Object.keys(AnimationId)) {
                const { imgSrc } = AnimationConfigs[id as unknown as AnimationId];
                promises.push(this.getImageAsync(imgSrc));
            }
            for (const id of Object.keys(TilesConfigs)) {
                const { imgSrc } = TilesConfigs[id as unknown as TileId];
                promises.push(this.getImageAsync(imgSrc));
            }
            for (const id of Object.keys(AssetUrls)) {
                const imgSrc = AssetUrls[id as unknown as AssetIds];
                promises.push(this.getImageAsync(imgSrc));
            }
            await Promise.all(promises);
        } catch (e) {
            console.log(e);
        }
    };

    public static getImageAsync = (imgSrc: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            if (this.spriteSheetCache.has(imgSrc)) {
                resolve(this.spriteSheetCache.get(imgSrc)!);
                return;
            }

            const imgElement = document.createElement("img");
            this.spriteSheetCache.set(imgSrc, imgElement);
            imgElement.src = imgSrc;
            imgElement.onload = () => {
                resolve(imgElement);
            };

            imgElement.onerror = (err) => {
                this.spriteSheetCache.delete(imgSrc);
                reject(err);
            };
        });

    public static getImage = (imgSrc: string): HTMLImageElement => {
        if (!this.spriteSheetCache.has(imgSrc)) {
            throw Error("Sprite not downloaded yet");
        }
        return this.spriteSheetCache.get(imgSrc)!;
    };
}
