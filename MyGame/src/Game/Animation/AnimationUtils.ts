import { type Indices } from "./AnimationConfig";

export const getNumFrames = (index1: Indices, index2: Indices) => {
    if (index2.row < index1.row) {
        throw Error("AnimationConfigBadIndex");
    }
    return index2.col - index1.col + 1;
};
