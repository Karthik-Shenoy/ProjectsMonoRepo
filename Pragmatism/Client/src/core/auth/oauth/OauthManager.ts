import { AppAuthContextType } from "@src/contexts/AppAuthContext/AppAuthContext";
import { GOOGLE_OAUTH_REDIRECT_URL } from "../AuthConstants";
import { AUTH_TIMEOUT_MS } from "./AuthConstants";
import { AuthCompletionResolver, AuthFailureRejector, AuthToken } from "./OauthContracts";

export enum OauthProvider {
    Google = "Google Login",
}

export class OauthManager {
    private static providerManagerMap: Map<OauthProvider, OauthManager> = new Map<
        OauthProvider,
        OauthManager
    >();

    private authCompletionResolver: AuthCompletionResolver | undefined;
    private authFailureRejector: AuthFailureRejector | undefined;
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
            this.internalRedirectToOauthPage(
                ({id, name, picture}) =>
                    resolve({
                        userId: id,
                        userName: name,
                        userProfilePictureUrl: picture
                    }) /* onAuthComplete */,
                reject /* onAuthFailure */
            );
            this.authSetTimeoutHandle = setTimeout(() => reject, AUTH_TIMEOUT_MS);
        });

    private internalRedirectToOauthPage = (
        onAuthComplete: AuthCompletionResolver,
        onAuthFailure: AuthFailureRejector
    ) => {
        this.authCompletionResolver = onAuthComplete;
        this.authFailureRejector = onAuthFailure;
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

    private authCompletionMessageHandler = async (ev: MessageEvent) => {
        try {
            const msg = JSON.parse(ev.data);
            if (msg?.kind == "AUTH-POPUP" && msg?.done == true) {
                try {
                    const res = await fetch(`${__API_URL__}/auth`, {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({
                            signature: msg.signature,
                            payload: msg.payload,
                        } as AuthToken),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) {
                        this.authFailureRejector?.(new Error("Failed to authenticate"));
                        return;
                    }

                    this.authCompletionResolver?.({
                        id: msg.userId,
                        name: msg.userName,
                        picture: msg.pictureUrl,
                    });
                    clearTimeout(this.authSetTimeoutHandle);
                } catch (e) {
                    this.authFailureRejector?.(new Error("Failed to authenticate"));
                    console.log(e);
                    clearTimeout(this.authSetTimeoutHandle);
                    return;
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
}
