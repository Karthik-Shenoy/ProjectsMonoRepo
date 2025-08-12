import * as React from "react"
import { FlexDiv, FlexItem } from "../FlexBox";
import { Checkbox } from "@shadcn/components/ui/checkbox";
import { cva } from "class-variance-authority";

export enum ChoiceTileVariant {
    default = "default",
    correct = "correct",
    incorrect = "incorrect"
}

const choiceTileCheckboxVariants = cva(
    "",
    {
        variants: {
            variant: {
                [ChoiceTileVariant.default]: "",
                [ChoiceTileVariant.correct]: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
                [ChoiceTileVariant.incorrect]: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
            }
        },
        defaultVariants: {
            variant: ChoiceTileVariant.default
        }
    }
)

const choiceTileTextVariants = cva(
    "text-md font-semibold text-start",
    {
        variants: {
            variant: {
                [ChoiceTileVariant.default]: "",
                [ChoiceTileVariant.correct]: "text-green-800",
                [ChoiceTileVariant.incorrect]: "text-red-800"
            }
        },
        defaultVariants: {
            variant: ChoiceTileVariant.default
        }
    }
)

export const ChoiceTile: React.FC<{
    label: string;
    onCheckedChange?: (checked: boolean) => void;
    variant?: ChoiceTileVariant;
    checked?: boolean;
}> = (props) => {
    return (
        <FlexDiv className="w-full h-full items-center justify-center gap-x-2" horizontal={true}>
            <FlexItem>
                <Checkbox
                    onCheckedChange={props.onCheckedChange}
                    checked={props.checked}
                    className={choiceTileCheckboxVariants({ variant: props.variant || ChoiceTileVariant.default })} />
            </FlexItem>
            <FlexDiv className="w-full h-full items-start" horizontal={false}>
                <span className={choiceTileTextVariants({ variant: props.variant || ChoiceTileVariant.default })}>
                    {props.label}
                </span>
            </FlexDiv>
        </FlexDiv>
    )
}