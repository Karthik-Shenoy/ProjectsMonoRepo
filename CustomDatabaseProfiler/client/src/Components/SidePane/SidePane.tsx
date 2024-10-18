import * as React from "react";
import { FlexItem } from "../FlexBox";
import { LayeredView } from "../../Pages/TreeView/LayeredView";

export const SidePane: React.FC = ({}) => {
    return (
        <div className="flex flex-col w-3/12 h-screen border-l-2 border-accent px-4 pt-4 gap-y-4">
            
            {/* execution time profiler */}
            <React.Suspense fallback={<div>Loading...</div>}>
                <GradientLineChartLazy />
            </React.Suspense>

            {/* layered view of the architecture */}
            <FlexItem>
                <LayeredView />
            </FlexItem>
        </div>
    );
};

const GradientLineChartLazy = React.lazy(() => import("./Components/LineChart/GradientLineChart"));
