type WindowResizeHandler = (evt: UIEvent) => void;

export class EventHandlerUtils {
    private static windowResizeHandlers: WindowResizeHandler[];
    private static instance: EventHandlerUtils | undefined;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new EventHandlerUtils();
        }
        return this.instance;
    }

    public addWindowResizeHandler = (callbackFn: WindowResizeHandler) => {
        EventHandlerUtils.windowResizeHandlers.push(callbackFn);
    };

    private constructor() {
        EventHandlerUtils.windowResizeHandlers = [];
        window.onresize = this.windowResizeHandler;
    }

    private windowResizeHandler = (evt: UIEvent) => {
        for (const callbackFn of EventHandlerUtils.windowResizeHandlers) {
            callbackFn(evt);
        }
    };
}
