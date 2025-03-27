import { Skeleton } from "@shadcn/components/ui/skeleton";

export default function ProblemDescriptionSkeleton() {
    return (
        <div className="w-full h-full">
            <div className="flex flex-col space-y-4 h-full w-full px-4 py-5 rounded-xl bg-accent">
                <Skeleton className="bg-ring h-8 w-3/4" />
                <Skeleton className="bg-ring h-6 w-full" />
                <Skeleton className="bg-ring h-6 w-5/6" />
            </div>
        </div>
    );
}