import { Skeleton } from "@shadcn/components/ui/skeleton";
import * as React from "react";

export type ImageProps = {
    width: number,
    height: number,
    url: string,
    className?: string
    errorFallback?: React.ReactNode
}

type ImageAsyncState = {
    isLoading: boolean,
    isError: boolean,
}

const ImageCache = new Map<string, HTMLImageElement>()

const getImageCacheKey = (url: string, width: number, height: number) => {
    return `${url}_${width}_${height}`
}

export const Image: React.FC<ImageProps> = ({ width, height, url, className, errorFallback }) => {
    const [imageAsyncState, setImageAsyncState] = React.useState<ImageAsyncState>({
        isLoading: true,
        isError: false
    })
    const imageDivRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {


        const img = ImageCache.get(getImageCacheKey(url, width, height))
        if (img !== undefined) {
            imageDivRef?.current?.appendChild(img);
            setImageAsyncState({
                isLoading: false,
                isError: false
            });
            return;
        }

        const imgElement = document.createElement("img")
        imgElement.src = url
        imgElement.onload = () => {
            setImageAsyncState({
                isLoading: false,
                isError: false
            });
            imageDivRef.current?.appendChild(imgElement);
        }

        imgElement.onerror = () => {
            setImageAsyncState({
                isLoading: false,
                isError: true
            });
            const imgElement = ImageCache.get(getImageCacheKey(url, width, height))
            imgElement?.remove();
            ImageCache.delete(getImageCacheKey(url, width, height))
        }

        imgElement.width = width;
        imgElement.height = height;
        if (className) {
            imgElement.className = className;
        }

        ImageCache.set(getImageCacheKey(url, width, height), imgElement)

    }, []);

    return (
        <div ref={imageDivRef} style={{
            width,
            height
        }} className={className}>
            {
                imageAsyncState.isLoading ?
                    <Skeleton className="w-full h-full" />
                    :
                    (
                        imageAsyncState.isError &&
                        (errorFallback ?? <Skeleton className="w-full h-full" />)
                    )
            }

        </div>
    )
}