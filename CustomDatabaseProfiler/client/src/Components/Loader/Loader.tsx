import { Loader2 } from "lucide-react";
import { FlexDiv } from "../FlexBox";

export type LoaderProps = {
    height: number;
    width: number;
};

export const Loader: React.FC<LoaderProps> = ({ height, width }) => {
    return (
        <FlexDiv horizontal className="items-center justify-center">
            <Loader2 height={height} width={width} className="animate-spin-slow" />
        </FlexDiv>
    );
};
