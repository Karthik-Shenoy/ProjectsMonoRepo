import { cn } from "@shadcn/lib/utils";
import * as React from "react";

export type FlexItemProps = {
    className?: string;
};

export const FlexItem: React.FC<React.PropsWithChildren<FlexItemProps>> = ({
    children,

    className,
}) => {
    return (
        <div
            className={cn(
                `h-auto w-auto flex-shrink`,
                className
            )}
        >
            {children}
        </div>
    );
};