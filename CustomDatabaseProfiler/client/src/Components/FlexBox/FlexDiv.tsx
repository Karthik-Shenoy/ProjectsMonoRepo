import { cn } from "@shadcn-ui/lib/utils";

export type FlexDivProps = {
    className?: string;
    horizontal?: boolean;
};

export const FlexDiv: React.FC<React.PropsWithChildren<FlexDivProps>> = ({
    children,
    horizontal,
    className,
}) => {
    return (
        <div
            className={cn(
                `flex ${
                    horizontal ? "flex-row" : "flex-col"
                } w-auto h-auto flex-nowrap overflow-ellipsis`,
                className
            )}
        >
            {children}
        </div>
    );
};
