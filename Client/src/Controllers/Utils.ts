import { GameState } from "../App/GameState";
import { Point } from "../Contracts/RendererContracts";
import { Ratios } from "../Shared/Constants";

export namespace MathUtils {
    export const getPlayersCircleRadius = () => {
        const { w, h } = GameState.getInstance().canvasDimensions;
        const radius = (Math.min(w, h) * Ratios.canvasToCircle) / 2;
        return radius;
    };

    export const getCanvasCenter = (): Point => {
        const { w, h } = GameState.getInstance().canvasDimensions;
        return { x: w / 2, y: h / 2 };
    };

    export const rotatePoints = ({ x, y }: Point, center: Point, radAngle: number): Point => {
        return {
            x: (x - center.x) * Math.cos(radAngle) - (y - center.y) * Math.sin(radAngle) + center.x,
            y: (x - center.x) * Math.sin(radAngle) + (y - center.y) * Math.cos(radAngle) + center.y,
        };
    };

    export const toDegrees = (rad: number): number => {
        return (180 * rad) / Math.PI;
    };

    /**
     * gets the rect draw coordinates such that, x and y are the center of the rectangle
     */
    export const getRectDrawCoordinates = (x: number, y: number, w: number, h: number): Point => {
        return { x: x - w / 2, y: y - h / 2 };
    }
}

export namespace RenderUtils {
    export const getGradient = (ctx: CanvasRenderingContext2D, width: number) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        return gradient;
    }
}
