import * as React from "react";
import { FlexDiv } from "../../FlexBox";
import { Image } from "../../../Components/Image/Image";

export type TableStatusIllustrationProps = {
    illustration: "success" | "error";
};

export const TableStatusIllustration: React.FC<TableStatusIllustrationProps> = ({
    illustration,
}) => {
    return (
        <FlexDiv className="bg-background w-full gap-y-3 p-8 justify-center items-center">
            {illustration === "success" ? (
                <>
                <Image src="./checked.png" width={128} height={128} />
                <span>Query Executed Successfully</span></>
            ) : (
                <>
                    <Image src="./error.png" width={128} height={128} />
                    <span>Some Error occurred</span>
                </>
            )}
        </FlexDiv>
    );
};
