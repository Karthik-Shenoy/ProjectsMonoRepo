"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderUtils = exports.GenericUtils = exports.MathUtils = void 0;
const GameState_1 = require("../App/GameState");
const Constants_1 = require("../Shared/Constants");
var MathUtils;
(function (MathUtils) {
    MathUtils.getPlayersCircleRadius = () => {
        const { w, h } = GameState_1.GameState.getInstance().canvasDimensions;
        const radius = (Math.min(w, h) * Constants_1.Ratios.canvasToCircle) / 2;
        return radius;
    };
    MathUtils.getCanvasCenter = () => {
        const { w, h } = GameState_1.GameState.getInstance().canvasDimensions;
        return { x: w / 2, y: h / 2 };
    };
    MathUtils.rotatePoints = ({ x, y }, center, radAngle) => {
        return {
            x: (x - center.x) * Math.cos(radAngle) - (y - center.y) * Math.sin(radAngle) + center.x,
            y: (x - center.x) * Math.sin(radAngle) + (y - center.y) * Math.cos(radAngle) + center.y,
        };
    };
    MathUtils.toDegrees = (rad) => {
        return (180 * rad) / Math.PI;
    };
    /**
     * gets the rect draw coordinates such that, x and y are the center of the rectangle
     */
    MathUtils.getRectDrawCoordinates = (x, y, w, h) => {
        return { x: x - w / 2, y: y - h / 2 };
    };
})(MathUtils || (exports.MathUtils = MathUtils = {}));
var GenericUtils;
(function (GenericUtils) {
    /**
     * returns 3 random distinct characters
     */
    GenericUtils.getRandomChars = () => {
        const randomChars = new Set();
        while (randomChars.size < 3) {
            const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            randomChars.add(randomChar);
        }
        return [...randomChars];
    };
})(GenericUtils || (exports.GenericUtils = GenericUtils = {}));
var RenderUtils;
(function (RenderUtils) {
    RenderUtils.getGradient = (ctx, width) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        return gradient;
    };
})(RenderUtils || (exports.RenderUtils = RenderUtils = {}));
