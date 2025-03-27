import { cn } from "@shadcn/lib/utils";
import * as React from "react";

export type GridDivProps = {
    className?: string;
};

export const GridDiv: React.FC<React.PropsWithChildren<GridDivProps>> = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                `grid w-auto h-auto box-border`,
                className
            )}
        >
            {children}
        </div>
    );
};
