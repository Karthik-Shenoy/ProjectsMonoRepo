"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlerUtils = void 0;
class EventHandlerUtils {
    static getInstance() {
        if (!this.instance) {
            this.instance = new EventHandlerUtils();
        }
        return this.instance;
    }
    constructor() {
        this.addWindowResizeHandler = (callbackFn) => {
            EventHandlerUtils.windowResizeHandlers.push(callbackFn);
        };
        this.windowResizeHandler = (evt) => {
            for (const callbackFn of EventHandlerUtils.windowResizeHandlers) {
                callbackFn(evt);
            }
        };
        EventHandlerUtils.windowResizeHandlers = [];
        window.onresize = this.windowResizeHandler;
    }
}
exports.EventHandlerUtils = EventHandlerUtils;
