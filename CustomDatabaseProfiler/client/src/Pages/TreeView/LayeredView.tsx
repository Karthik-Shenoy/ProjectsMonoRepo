import { Dialog, DialogContent, DialogTrigger } from "@shadcn-ui/components/ui/dialog";
import * as React from "react";
import { GradientBorderWrapper } from "../../Components/GradientBorderWrapper/GradientBorderWrapper";
import { LayerNode } from "./Components/LayerNode";
import { FlexDiv } from "../../Components/FlexBox";
import { layeredViewData } from "./LayerComponents";

export type LayeredViewProps = {};

export const LayeredView: React.FC<LayeredViewProps> = () => {
    return (
        <Dialog>
            <GradientBorderWrapper className="w-fit h-fit">
                <DialogTrigger className="bg-background px-4 py-2 rounded-sm">
                    View Layers
                </DialogTrigger>
            </GradientBorderWrapper>

            <DialogContent>
                <FlexDiv className="items-center justify-center gap-y-8 w-full">
                    {layeredViewData.map((layer) => (
                        <LayerNode
                            key={layer.text}
                            text={layer.text}
                            icon={layer.icon}
                            languageImg={layer.languageImg}
                        />
                    ))}
                </FlexDiv>
            </DialogContent>
        </Dialog>
    );
};
