import { AppAuthContextType } from "@src/contexts/AppAuthContext/AppAuthContext";
import { GOOGLE_OAUTH_REDIRECT_URL } from "../AuthConstants";
import { AUTH_TIMEOUT_MS } from "./AuthConstants";
import { AuthCompletionResolver } from "./OauthContracts";

export enum OauthProvider {
    Google = "Google Login",
}

export class OauthManager {
    private static providerManagerMap: Map<OauthProvider, OauthManager> = new Map<
        OauthProvider,
        OauthManager
    >();

    private authCompletionResolver: AuthCompletionResolver | undefined;
    private authSetTimeoutHandle: NodeJS.Timeout | undefined;

    private constructor(private provider: OauthProvider) {
        window.onmessage = this.authCompletionMessageHandler;
    }

    public static getInstance(provider: OauthProvider) {
        let manager = OauthManager.providerManagerMap.get(provider);
        if (manager == undefined) {
            manager = new OauthManager(provider);
            OauthManager.providerManagerMap.set(provider, manager);
        }
        return manager;
    }

    public redirectToAuthPage = () =>
        new Promise<AppAuthContextType>((resolve, reject) => {
            this.internalRedirectToOauthPage((authToken, userName) =>
                resolve({
                    token: authToken,
                    userName,
                })
            );
            this.authSetTimeoutHandle = setTimeout(() => reject, AUTH_TIMEOUT_MS);
        });

    private internalRedirectToOauthPage = (onAuthComplete: AuthCompletionResolver) => {
        this.authCompletionResolver = onAuthComplete;
        switch (this.provider) {
            case OauthProvider.Google: {
                this.openAuthPopup(GOOGLE_OAUTH_REDIRECT_URL);
                break;
            }
        }
    };

    private openAuthPopup = (authUrl: string) => {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            authUrl,
            this.provider,
            `width=${width},height=${height},left=${left},top=${top}`
        );
    };

    private authCompletionMessageHandler = (ev: MessageEvent) => {
        const msg = JSON.parse(ev.data);
        if (msg?.kind == "AUTH-POPUP" && msg?.done == true) {
            this.authCompletionResolver?.(
                { signature: msg.signature, payload: msg.payload },
                msg.userName
            );
            clearTimeout(this.authSetTimeoutHandle);
        }
    };
}
