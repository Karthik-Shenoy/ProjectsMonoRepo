import { Skeleton } from "@shadcn/components/ui/skeleton";
import * as React from "react";

export type ImageProps = {
    width: number,
    height: number,
    url: string,
    className?: string
}

const ImageCache = new Map<string, HTMLImageElement>()

export const Image: React.FC<ImageProps> = ({ width, height, url, className }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const imageDivRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        

        const img = ImageCache.get(url)
        if (img !== undefined) {
            imageDivRef?.current?.appendChild(img);
            setIsLoading(false);
            return;
        }
        
        const imgElement = document.createElement("img")
        imgElement.src = url
        imgElement.onload = () => {
            setIsLoading(false)
            imageDivRef.current?.appendChild(imgElement);
        }
            
        imgElement.width = width;
        imgElement.height = height;
        if (className) {
            imgElement.className = className;
        }

        ImageCache.set(url, imgElement)
        
    }, []);

    return (
        <div ref={imageDivRef} style={{
            width,
            height
        }} className={className}>
            {isLoading &&
                <Skeleton className="w-full h-full" />}
        </div>
    )
}