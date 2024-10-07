import * as React from "react";
import { FlexDiv } from "../../FlexBox";
import { Skeleton } from "@shadcn-ui/components/ui/skeleton";

export const TableSkeleton: React.FC<{}> = () => {
    return (
        <FlexDiv className="bg-background w-full gap-y-3 p-8">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-8/12 h-6" />
            <Skeleton className="w-6/12 h-4" />
            <Skeleton className="w-9/12 h-8" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-4/12 h-10" />
            <Skeleton className="w-full h-8" />
        </FlexDiv>
    );
};
