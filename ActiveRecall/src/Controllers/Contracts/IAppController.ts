import { BaseScreenProps } from "src/ViewControllerInterop/SharedTypes";

export interface IAppController {
    showScreen(props: BaseScreenProps): void;
    updateProps(props: BaseScreenProps): void;
}
