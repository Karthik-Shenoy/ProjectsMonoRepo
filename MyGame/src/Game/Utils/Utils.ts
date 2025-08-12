import type { Coordinates } from "../Contracts/RendererContracts";

export const rotateAboutAnotherPoint = (p1: Coordinates, p2: Coordinates, angleRad: number): { x: number; y: number } => {
    const {x, y} = p1;
    const {x: cx, y: cy} = p2;
    
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    // Translate point to origin
    let translatedX = x - cx;
    let translatedY = y - cy;

    // Rotate point
    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;

    // Translate point back
    return {
        x: rotatedX + cx,
        y: rotatedY + cy,
    };
}