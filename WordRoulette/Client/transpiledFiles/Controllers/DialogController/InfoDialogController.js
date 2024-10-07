"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoDialogController = void 0;
const Constants_1 = require("../../Shared/Constants");
class InfoDialogController {
    constructor(message) {
        this.dispose = () => {
            this.dialogElement.close();
        };
        this.dialogElement = document.getElementById(Constants_1.HTMLElementIds.dialog);
        this.dialogElement.showModal();
        // hide word prompt content
        const wordPromptDialogContent = document.getElementById(Constants_1.HTMLElementIds.wordPromptDialogContent);
        wordPromptDialogContent.style.display = "none";
        // show info content
        const infoDialogContent = document.getElementById(Constants_1.HTMLElementIds.infoDialogContent);
        infoDialogContent.style.display = "flex";
        const infoDialogText = document.getElementById(Constants_1.HTMLElementIds.infoDialogText);
        infoDialogText.innerText = message;
    }
}
exports.InfoDialogController = InfoDialogController;
