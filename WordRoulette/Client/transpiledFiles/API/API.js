"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const Constants_1 = require("../Shared/Constants");
var API;
(function (API) {
    API.createGame = (userName, roomId) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${Constants_1.GAME_SERVER_URL}/create-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                roomId,
            }),
        });
        switch (response.status) {
            case 200: {
                return response;
            }
            case 400: {
                throw new Error("Room already exists");
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    });
    API.joinGame = (userName, roomId) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${Constants_1.GAME_SERVER_URL}/join-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                roomId,
            }),
        });
        switch (response.status) {
            case 200: {
                return yield response.json();
            }
            case 400: {
                throw new Error("Room does not exist");
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    });
    API.isWordValid = (word) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${Constants_1.GAME_SERVER_URL}/isWordValid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                word
            }),
        });
        switch (response.status) {
            case 200: {
                return yield response.json();
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    });
})(API || (exports.API = API = {}));
