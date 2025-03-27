import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@shadcn/components/ui/card";
import { Skeleton } from "@shadcn/components/ui/skeleton";

export const ProblemCardSkeleton: React.FC = () => {
    return (
        <Card className="max-w-sm shadow-md hover:shadow-lg transition-shadow border-[0.5px] border-foreground">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-3/4" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-1/2" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
};
