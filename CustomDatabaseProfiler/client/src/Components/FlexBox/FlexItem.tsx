import { cn } from "@shadcn-ui/lib/utils";

export type FlexItemProps = {
    className?: string;
};

export const FlexItem: React.FC<React.PropsWithChildren<FlexItemProps>> = ({
    children,
    className,
}) => {
    return <div className={cn("flex-shrink text-ellipsis w-auto h-auto", className)}>{children}</div>;
};
