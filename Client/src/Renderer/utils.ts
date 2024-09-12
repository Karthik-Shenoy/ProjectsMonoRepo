import { EventHandlerUtils } from "../Shared/EventHandlerUtils";

export type WindowResizeHandler = (w: number, h: number) => void;

export const addWindowResizeHandler = (callbackFn: WindowResizeHandler) => {
    EventHandlerUtils.getInstance().addWindowResizeHandler((evt: UIEvent) => {
        const windowRef = evt.target as Window;
        const { w, h } = { w: windowRef.innerWidth, h: windowRef.innerHeight };
        callbackFn(w, h);
    })
};
