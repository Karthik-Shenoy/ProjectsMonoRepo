import { Button } from "@shadcn-ui/components/ui/button";
import { cn } from "@shadcn-ui/lib/utils";
import * as React from "react";

export type GradientButtonProps = {
    text?: string;
    className?: string;
    onClick?: () => void;
};

export const GradientButton: React.FC<GradientButtonProps> = ({ text, className, onClick }) => {
    return (
        <Button
            className={cn(
                "w-[150px] h-12 rounded-lg bg-gradient-to-r from-purple-700 via-blue-600 to-red-700 hover:p-[3px] transition-all duration-500 p-[2px]"
            )}
            onClick={onClick}
        >
            <div
                className={cn(
                    "w-full h-full rounded-md bg-background flex items-center justify-center",
                    className
                )}
            >
                <p className="text-accent-foreground text-xl">{text}</p>
            </div>
        </Button>
    );
};
