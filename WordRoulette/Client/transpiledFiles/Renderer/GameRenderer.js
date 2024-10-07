"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRenderer = void 0;
const GameState_1 = require("../App/GameState");
const Constants_1 = require("../Shared/Constants");
const Utils = __importStar(require("./utils"));
/**
 * singleton class renders everything
 */
class GameRenderer {
    static getInstance() {
        if (!this.instance) {
            const gameCanvas = document.getElementById(Constants_1.HTMLElementIds.gameCanvas);
            this.instance = new GameRenderer(gameCanvas);
        }
        return this.instance;
    }
    get canvasDimensions() {
        return { w: this.gameCanvas.width, h: this.gameCanvas.height };
    }
    initializeCanvas() {
        this.setCanvasDimensions(window.innerWidth, window.innerHeight);
    }
    setCanvasDimensions(w, h) {
        this.gameCanvas.width = w * 0.9;
        this.gameCanvas.height = h * 0.9;
    }
    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.render = () => {
            const gameState = GameState_1.GameState.getInstance();
            this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            for (const drawableObject of gameState.drawableObjectsList) {
                drawableObject.render(this.ctx);
            }
            requestAnimationFrame(this.render);
        };
        this.windowResizeHandler = (w, h) => {
            this.setCanvasDimensions(w, h);
        };
        Utils.addWindowResizeHandler(this.windowResizeHandler);
        this.initializeCanvas();
        this.ctx = gameCanvas.getContext("2d");
    }
}
exports.GameRenderer = GameRenderer;
