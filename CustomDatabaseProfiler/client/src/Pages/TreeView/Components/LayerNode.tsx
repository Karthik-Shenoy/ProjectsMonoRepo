import * as React from "react";
import { GradientBorderWrapper } from "../../../Components/GradientBorderWrapper/GradientBorderWrapper";
import { FlexDiv, FlexItem } from "../../../Components/FlexBox";

export type LayerNodeProps = {
    text: string;
    icon: React.ReactNode;
    languageImg?: React.ReactNode;
};

export const LayerNode: React.FC<LayerNodeProps> = (props) => {
    return (
        <GradientBorderWrapper className="w-fit h-fit">
            <FlexDiv
                className="bg-background desktop:w-80 mobile:w-60  h-16 px-4 py-2 gap-x-4 justify-center items-center"
                horizontal
            >
                <FlexItem>{props.icon}</FlexItem>
                <FlexItem className="text-xl w-9/12">{props.text}</FlexItem>
                <FlexItem>{props.languageImg}</FlexItem>
            </FlexDiv>
        </GradientBorderWrapper>
    );
};
