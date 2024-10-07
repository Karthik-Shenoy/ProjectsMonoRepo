"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDegrees = exports.rotatePoints = exports.getCanvasCenter = exports.getPlayersCircleRadius = void 0;
const GameState_1 = require("../App/GameState");
const Constants_1 = require("../Shared/Constants");
const getPlayersCircleRadius = () => {
    const { w, h } = GameState_1.GameState.getInstance().canvasDimensions;
    const radius = (Math.min(w, h) * Constants_1.Ratios.canvasToCircle) / 2;
    return radius;
};
exports.getPlayersCircleRadius = getPlayersCircleRadius;
const getCanvasCenter = () => {
    const { w, h } = GameState_1.GameState.getInstance().canvasDimensions;
    return { x: w / 2, y: h / 2 };
};
exports.getCanvasCenter = getCanvasCenter;
const rotatePoints = ({ x, y }, center, radAngle) => {
    return {
        x: (x - center.x) * Math.cos(radAngle) - (y - center.y) * Math.sin(radAngle) + center.x,
        y: (x - center.x) * Math.sin(radAngle) + (y - center.y) * Math.cos(radAngle) + center.y,
    };
};
exports.rotatePoints = rotatePoints;
const toDegrees = (rad) => {
    return (180 * rad) / Math.PI;
};
exports.toDegrees = toDegrees;
