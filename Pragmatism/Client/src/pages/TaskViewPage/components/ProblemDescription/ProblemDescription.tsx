import * as React from "react";
import { componentMappings } from "./MarkdownComponentMappings";
import ProblemDescriptionSkeleton from "./Skeletons/ProblemDescriptionSkeleton";

export type ProblemDescriptionProps = {

}

const ReactMarkdownLazy = React.lazy(() =>
    import("react-markdown").then((module) => {
        return module
    })
)

export const ProblemDescription: React.FC<ProblemDescriptionProps> = () => {

    const [problemDescriptionMarkdown, setProblemDescriptionMarkdown] = React.useState<string>("");

    React.useEffect(() => {

        fetch(
            "/ProblemDescription.md",
            {
                method: "GET",
            }
        ).then((res) => {
            return res.text();

        }).then((markdown) => {
            setProblemDescriptionMarkdown(markdown)
        })
    }, [])

    return (
        <React.Suspense fallback={<ProblemDescriptionSkeleton />}>
            <ReactMarkdownLazy components={componentMappings}>
                {problemDescriptionMarkdown}
            </ReactMarkdownLazy>
        </React.Suspense>
    )
} 