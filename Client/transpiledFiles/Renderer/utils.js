"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWindowResizeHandler = void 0;
const EventHandlerUtils_1 = require("../Shared/EventHandlerUtils");
const addWindowResizeHandler = (callbackFn) => {
    EventHandlerUtils_1.EventHandlerUtils.getInstance().addWindowResizeHandler((evt) => {
        const windowRef = evt.target;
        const { w, h } = { w: windowRef.innerWidth, h: windowRef.innerHeight };
        callbackFn(w, h);
    });
};
exports.addWindowResizeHandler = addWindowResizeHandler;
