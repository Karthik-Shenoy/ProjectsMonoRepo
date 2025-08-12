import { App, Modal, Plugin } from "obsidian";
import * as ReactDOM from "react-dom/client"
import * as React from "react"
import { AppEntryPoint } from "./View/App";

import "../styles.css"
import { AppInit } from "./app-init";
import { IAppController } from "./Controllers/Contracts/IAppController";
import bootstrapServices from "./Services/ServiceBootstrapper";

export class AppModal extends Modal {
    private static MOUNT_CHECK_INTERVAL_MS = 100;

    private customApp: AppInit;
    private appControllerRef: React.RefObject<IAppController | null>;
    constructor(app: App, plugin: Plugin) {
        super(app);
        bootstrapServices();
        this.titleEl.setText("Active Recall");
        this.customApp = new AppInit(app, plugin);
        this.appControllerRef = React.createRef<IAppController>();
    }

    onOpen() {
        const { contentEl } = this;
        this.adjustStyles();

        const reactRoot = ReactDOM.createRoot(contentEl);

        reactRoot.render(<AppEntryPoint ref={this.appControllerRef} />)
        this.didAppMount().then(
            (appControllerRef) => this.customApp.setAppController(appControllerRef)
        )
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        this.customApp.dispose();
    }

    private adjustStyles() {
        this.modalEl.classList.add("active-recall-modal");
    }

    private didAppMount = (): Promise<IAppController> => {
        const appMountCheckDelegate = (): Promise<IAppController> => {
            return new Promise<IAppController>((resolve) => {
                if (this.appControllerRef.current) {
                    resolve(this.appControllerRef.current);
                } else {
                    setTimeout(() => appMountCheckDelegate().then(resolve), AppModal.MOUNT_CHECK_INTERVAL_MS);
                }
            });
        };
        return appMountCheckDelegate();
    }
}