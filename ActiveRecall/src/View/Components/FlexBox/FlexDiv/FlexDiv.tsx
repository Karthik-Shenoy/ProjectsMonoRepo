import { cn } from "@shadcn/lib/utils";
import * as React from "react";



export const FlexDiv: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLDivElement> & { horizontal: boolean, className: string }>> = (props) => {
    return (
        <div
            {...props}
            className={cn(`flex ${props.horizontal ? "flex-row" : "flex-col"} 
            flex-nowrap w-auto h-auto box-border [&>*]:text-ellipsis [&>:not(:first-child)]:mt-0 [&>*:not(.ms-StackItem)]:flex-shrink`, props.className)}
        >
            {props.children}
        </div>
    );
};


