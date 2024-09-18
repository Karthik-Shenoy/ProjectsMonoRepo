import { API } from "../../API/API";
import { GameState } from "../../App/GameState";
import { RTCManager } from "../../RTC/RTCManager";
import { HTMLElementIds, WORD_ENTRY_TIME } from "../../Shared/Constants";
import { GenericUtils } from "../Utils";

const enterKey = "Enter";

export class InputDialogController {
    private submitButton: HTMLButtonElement;
    private wordInputTextBox: HTMLInputElement;
    private dialogElement: HTMLDialogElement;
    private submitCallback: ((word: string) => void) | undefined;
    private setTimeoutHandle: number | undefined;
    private currRandomChars: [string, string, string] | undefined;

    constructor(private previousWord: string) {
        this.currRandomChars = GenericUtils.getRandomChars();
        this.dialogElement = document.getElementById(HTMLElementIds.dialog) as HTMLDialogElement;
        this.dialogElement.showModal();

        // hide info content
        const infoDialogContent = document.getElementById(
            HTMLElementIds.infoDialogContent
        ) as HTMLDivElement;
        infoDialogContent.style.display = "none";

        // show word prompt content
        const wordPromptDialogContent = document.getElementById(
            HTMLElementIds.wordPromptDialogContent
        ) as HTMLDivElement;
        wordPromptDialogContent.style.display = "flex";

        this.wordInputTextBox = document.getElementById(
            HTMLElementIds.wordInputTextBox
        ) as HTMLInputElement;
        this.wordInputTextBox.focus();

        this.submitButton = document.getElementById(
            HTMLElementIds.submitButton
        ) as HTMLButtonElement;
        this.submitButton.onclick = () => {
            this.submitHandler();
        };

        this.wordInputTextBox.onkeydown = (event) => {
            if (event.key === enterKey) {
                this.submitHandler();
            }
        };

        this.updatePreviousWordPrompt();

        this.createTimer();
        
    }

    public setOnSubmitCallback = (callback: (word: string) => void) => {
        this.submitCallback = callback;
    };

    private updatePreviousWordPrompt() {
        // move to a different function
        const randomCharsSpan = document.getElementById(
            HTMLElementIds.randomCharsSpan
        ) as HTMLSpanElement;
        randomCharsSpan.textContent = this.currRandomChars?.join(", ") ?? "";

        const firstPreviousWordPrompt = document.getElementById(
            HTMLElementIds.firstPreviousWordPrompt
        ) as HTMLParagraphElement;
        const previousWordPrompt = document.getElementById(
            HTMLElementIds.previousWordPrompt
        ) as HTMLParagraphElement;
        if (!this.previousWord) {
            previousWordPrompt.style.display = "none";
            return;
        }
        previousWordPrompt.style.display = "block";
        firstPreviousWordPrompt.style.display = "none";

        const previousWordSpan = document.getElementById(
            HTMLElementIds.previousWordSpan
        ) as HTMLSpanElement;
        previousWordSpan.textContent = this.previousWord;
    }

    private dispose = () => {
        this.dialogElement.close();
        this.submitButton.onclick = null;
        this.submitCallback = undefined;
        clearTimeout(this.setTimeoutHandle);
    };

    private submitHandler = async (shouldSubmitEmpty: boolean = false) => {
        let word = this.wordInputTextBox.value.toLowerCase().trim();

        try {
            if (shouldSubmitEmpty) {
                word = "";
            }
            !shouldSubmitEmpty && (await this.validateWord(word));

            this.hideErrorOutputDiv();

            this.submitCallback?.(word);
            RTCManager.getInstance().sendWord(word, GameState.getInstance().getLocalPlayerName());
            this.wordInputTextBox.value = "";
            this.dispose();
        } catch (error: any) {
            this.showError(error.message);
        }
    };

    private validateWord = async (word: string) => {
        if (word.length === 0) {
            throw new Error("Word cannot be empty");
        }

        const response = await API.isWordValid(word);

        if (!response.isValid) {
            throw new Error("the given word is not valid english word");
        }

        // check if word includes any 2 of the random chars
        if (
            !this.currRandomChars?.some((char) => word.includes(char)) ||
            this.currRandomChars?.filter((char) => word.includes(char)).length < 2
        ) {
            throw new Error("Word does not contain 2 of the random chars");
        }

        if (
            this.previousWord.length > 0 &&
            word[0].toLowerCase() !== this.previousWord[this.previousWord.length - 1].toLowerCase()
        ) {
            throw new Error("Word does not start with the correct letter");
        }

        // check if word is present in english using api call
    };

    private createTimer = () => {
        const timerText = document.getElementById(HTMLElementIds.timerText) as HTMLParagraphElement;
        const updateTime = (time: number) => {
            timerText.innerText = time.toString();
            if (time >= WORD_ENTRY_TIME) {
                this.submitHandler(true);
                return;
            }
            this.setTimeoutHandle = setTimeout(updateTime, 1000, time + 1);
        };
        this.setTimeoutHandle = setTimeout(updateTime, 0, 0);
    };

    private showError(error: string) {
        const wordErrorOutput = document.getElementById(
            HTMLElementIds.wordErrorOutput
        ) as HTMLDivElement;
        wordErrorOutput.style.display = "block";
        wordErrorOutput.innerText = error;
    }

    private hideErrorOutputDiv() {
        const wordErrorOutput = document.getElementById(
            HTMLElementIds.wordErrorOutput
        ) as HTMLDivElement;
        wordErrorOutput.style.display = "none";
    }
}
