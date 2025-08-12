import { cn } from "@shadcn/lib/utils";
import * as React from "react";

export const FlexItem: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>> = (props) => {
    return (
        <div  {...props} className={cn("h-auto w-auto flex-shrink", props.className)}>
            {props.children}
        </div>
    );
}
