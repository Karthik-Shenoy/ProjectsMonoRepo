export interface IDrawableObject {
    /**
     * update and render are kept separate to allow for
     * replay-ability without having to render, this is useful
     * for debugging and testing purposes.
     * @param delta
     */
    update(delta: number): void;
    render: (ctx: CanvasRenderingContext2D) => void;
    getUID: () => string;
}

/**
 * Delegate interface for drawing objects.
 */
export interface IRenderDelegate {
    render: (ctx: CanvasRenderingContext2D) => void;
    update: (delta: number) => void;
}

export interface ITickHandler {
    update: (delta: number) => void;
}

export type Dimensions = {
    w: number;
    h: number;
};

export type Coordinates = {
    x: number;
    y: number;
};

export type Velocity = {
    dx: number;
    dy: number;
};
