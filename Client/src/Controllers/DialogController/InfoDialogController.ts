import { HTMLElementIds } from "../../Shared/Constants";

export class InfoDialogController{
    private dialogElement: HTMLDialogElement;
    constructor(message: string){
        this.dialogElement = document.getElementById(HTMLElementIds.dialog) as HTMLDialogElement;
        this.dialogElement.showModal();

        // hide word prompt content
        const wordPromptDialogContent = document.getElementById(HTMLElementIds.wordPromptDialogContent) as HTMLDivElement;
        wordPromptDialogContent.style.display = "none";

        // show info content
        const infoDialogContent = document.getElementById(HTMLElementIds.infoDialogContent) as HTMLDivElement;
        infoDialogContent.style.display = "flex";

        const infoDialogText = document.getElementById(HTMLElementIds.infoDialogText) as HTMLParagraphElement;
        infoDialogText.innerText = message;
    }

    public dispose = () => {
        this.dialogElement.close();
    }
}