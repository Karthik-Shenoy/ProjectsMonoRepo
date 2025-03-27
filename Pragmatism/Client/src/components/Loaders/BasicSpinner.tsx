import { cn } from "@shadcn/lib/utils";
import { Loader2 } from "lucide-react";
import { FlexDiv, FlexItem } from "../FlexBox";
import { Typography } from "../Typography";

export type SpinnerProps = {
    className?: string
}

export default function BasicSpinner({ className }: SpinnerProps) {
    return <Loader2 className={cn("h-6 w-6 animate-spin text-gray-500", className)} />;
}

type BasicSpinnerLoaderWrapperProps = {
    showLoader: boolean
    description?: string
    loaderClassName?: string
}

export const BasicSpinnerLoaderWrapper: React.FC<React.PropsWithChildren<BasicSpinnerLoaderWrapperProps>> = ({ showLoader, description, loaderClassName, children }) => {
    return (
        showLoader ?
            <FlexDiv horizontal={false} className="justify-center items-center gap-x-2">
                <BasicSpinner className={loaderClassName} />
                <FlexItem>
                    <Typography variant="caption">
                        {description}
                    </Typography>
                </FlexItem>
            </FlexDiv>
            :
            <>
                {children}
            </>
    )
}