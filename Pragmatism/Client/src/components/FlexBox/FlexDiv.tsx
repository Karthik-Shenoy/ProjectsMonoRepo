import { cn } from "@shadcn/lib/utils";
import * as React from "react";

export type FlexDivProps = {
    horizontal?: boolean;
    className?: string;
};

export const FlexDiv: React.FC<React.PropsWithChildren<FlexDivProps>> = ({
    children,
    horizontal,
    className,
}) => {
    return (
        <div
            className={cn(
                `flex flex-nowrap text-ellipsis w-auto h-auto box-border ${
                // if horizontal is undefined, use className to determine flex direction
                horizontal ? "flex-row" : "flex-col"
                }`,
                className
            )}
        >
            {children}
        </div>
    );
};