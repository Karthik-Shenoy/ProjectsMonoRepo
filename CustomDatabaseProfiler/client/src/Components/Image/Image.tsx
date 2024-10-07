import * as React from "react";
import { Skeleton } from "@shadcn-ui/components/ui/skeleton";
import { getImageFromCache } from "./ImageCache";

export type ImageProps = {
    src: string;
    alt?: string;
    width: number;
    height: number;
};

export const Image: React.FC<ImageProps> = ({ src, alt, width, height }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const divRef = React.useRef<HTMLDivElement>(null);

    const onImageLoad = React.useCallback(() => {
        setIsLoaded(true);
        divRef.current?.appendChild(imgElement);
    }, []);

    const imgElement = React.useMemo(() => {
        return getImageFromCache(src, alt ?? "", width, height, onImageLoad);
    }, []);

    return (
        <>
            <div style={{ height: height, width: width }} ref={divRef}>
                {!isLoaded && <Skeleton className="h-full w-full" />}
            </div>
        </>
    );
};
