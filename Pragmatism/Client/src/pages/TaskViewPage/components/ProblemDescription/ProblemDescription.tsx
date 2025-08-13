import * as React from "react";
import { componentMappings } from "./MarkdownComponentMappings";
import ProblemDescriptionSkeleton from "./Skeletons/ProblemDescriptionSkeleton";
import { useTaskViewContext } from "../../contexts";

export type ProblemDescriptionProps = {

}

const ReactMarkdownLazy = React.lazy(() =>
    import("react-markdown").then((module) => {
        return module
    })
)

export const ProblemDescription: React.FC<ProblemDescriptionProps> = () => {
    const { taskDataFetchState } = useTaskViewContext();

    const [problemDescriptionMarkdown, setProblemDescriptionMarkdown] = React.useState<string>("");

    React.useEffect(() => {
        const { data } = taskDataFetchState;
        if (!data) {
            return;
        }
        fetch(
            data?.markdownUrl,
            {
                method: "GET",
            }
        ).then((res) => {
            return res.text();

        }).then((markdown) => {
            setProblemDescriptionMarkdown(markdown)
        })
    }, [taskDataFetchState])

    return (
        <React.Suspense fallback={<ProblemDescriptionSkeleton />}>
            <ReactMarkdownLazy components={componentMappings}>
                {problemDescriptionMarkdown}
            </ReactMarkdownLazy>
        </React.Suspense>
    )
} 