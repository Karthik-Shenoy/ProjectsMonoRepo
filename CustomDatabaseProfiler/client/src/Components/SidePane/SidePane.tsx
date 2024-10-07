import * as React from "react";
import { GradientLineChart } from "./Components/LineChart/GradientLineChart";
import { Combobox } from "./Components/Combobox/Combobox";
import { FlexDiv, FlexItem } from "../FlexBox";
import { LayeredView } from "../../Pages/TreeView/LayeredView";

export const SidePane: React.FC = ({}) => {
    return (
        <div className="flex flex-col w-3/12 h-screen border-l-2 border-accent px-4 pt-4 gap-y-4">
            {/* Storage engine choice */}
            <FlexDiv horizontal className="justify-center items-center">
                <Combobox />
            </FlexDiv>
            {/* execution time profiler */}
            <GradientLineChart />

            {/* layered view of the architecture */}
            <FlexItem>
                <LayeredView />
            </FlexItem>
        </div>
    );
};
