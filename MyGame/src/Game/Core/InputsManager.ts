import type { ITickHandler } from "../Contracts/RendererContracts";

export interface IKeyboardInputHandler {
    /**
     * Handles keyboard input events.
     * @param event - The keyboard event to handle.
     */
    handleKeyboardInput(keys: string): void;
}

export class InputsManager implements ITickHandler {
    private static _instance: InputsManager | undefined;
    private keysPressed: string[];
    private handlers: IKeyboardInputHandler[] = [];

    private constructor() {
        this.keysPressed = [];
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("keydown", this.handleKeyDown);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        if (!this.keysPressed.includes(key)) {
            this.keysPressed.push(key);
        }
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key;
        const index = this.keysPressed.indexOf(key);
        if (index > -1) {
            this.keysPressed.splice(index, 1);
        }
    };

    private notify = () => {
        for (const handler of this.handlers) {
            // notify the handler with the last keys pressed
            handler.handleKeyboardInput(this.keysPressed[this.keysPressed.length - 1] ?? "");
        }
    };

    public update(_delta: number) {
        // Call notify to handle the last key pressed
        this.notify();
    }

    public addHandler(handler: IKeyboardInputHandler) {
        this.handlers.push(handler);
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new InputsManager();
        }
        return this._instance;
    }
}
