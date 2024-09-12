"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerUtils = void 0;
var ContainerUtils;
(function (ContainerUtils) {
    ContainerUtils.removeFromList = (list, index) => {
        return list.slice(0, index).concat(list.slice(index + 1));
    };
})(ContainerUtils || (exports.ContainerUtils = ContainerUtils = {}));
