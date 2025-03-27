export type AuthToken = {
    payload: string;
    signature: string;
};


export type AuthCompletionResolver = (authResponse: AuthToken, userName: string) => void;
