import { Input } from "@shadcn-ui/components/ui/input";
import { cn } from "@shadcn-ui/lib/utils";
import * as React from "react";
import { GradientBorderWrapper } from "../GradientBorderWrapper/GradientBorderWrapper";

export type GradientInputProps = {
    className?: string;
    placeholder?: string;
    id?: string;
    wrapperClassName?: string;
};

export const GradientInput = React.forwardRef<
    HTMLInputElement,
    GradientInputProps
>(({ placeholder, id, className, wrapperClassName }, ref) => {
    return (
        <GradientBorderWrapper className={wrapperClassName}>
            <Input
                className={cn("w-full h-full rounded-sm bg-background appearance-none", className)}
                placeholder={placeholder}
                id={id}
                ref={ref}
            />
        </GradientBorderWrapper>
    );
});
