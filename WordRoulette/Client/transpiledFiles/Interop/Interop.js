"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interop = void 0;
var interop;
(function (interop) {
    let MessageType;
    (function (MessageType) {
        MessageType[MessageType["INIT"] = 0] = "INIT";
        MessageType[MessageType["GAME_START"] = 1] = "GAME_START";
        MessageType[MessageType["WORD"] = 2] = "WORD";
        MessageType[MessageType["DEATH"] = 3] = "DEATH";
        MessageType[MessageType["GAME_START_BROADCAST"] = 4] = "GAME_START_BROADCAST";
    })(MessageType = interop.MessageType || (interop.MessageType = {}));
})(interop || (exports.interop = interop = {}));
