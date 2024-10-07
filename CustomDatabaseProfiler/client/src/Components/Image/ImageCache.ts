const imageCache = new Map<string, HTMLImageElement>();

export const getImageFromCache = (
    src: string,
    alt: string,
    width: number,
    height: number,
    onLoad: () => void
): HTMLImageElement => {
    const cachedImage = imageCache.get(src);
    if (cachedImage) {
        queueMicrotask(onLoad);
        return cachedImage.cloneNode() as HTMLImageElement;
    }

    const image = document.createElement("img");
    image.src = src;
    image.alt = alt ?? "";
    image.width = width;
    image.height = height;
    image.onload = onLoad;

    imageCache.set(src, image);

    return image;
};
