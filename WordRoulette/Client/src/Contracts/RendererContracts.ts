export interface IDrawable {
    /**
     * all logic for rendering the given object
     */
    render: (ctx: CanvasRenderingContext2D) => void;
}

export type Point = {
    x: number;
    y: number;
}

export type Dimensions = {
    w: number;
    h: number;
}