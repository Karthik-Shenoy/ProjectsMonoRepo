import * as React from 'react';
import { LoginDialogAsyncState } from './LoginDialog';

export type SetLoginDialogAsyncStateCallback = React.Dispatch<React.SetStateAction<LoginDialogAsyncState>>;

export const useLoginDialogAsyncState = () => {
    const [asyncState, setAsyncState] = React.useState<LoginDialogAsyncState>({
        isLoading: false,
        error: null
    });

    const refreshAsyncState = () => {
        setAsyncState(
            {
                isLoading: false,
                error: null
            }
        )
    }

    return {
        loginDialogAsyncState: asyncState,
        refreshLoginDialogAsyncState: refreshAsyncState,
        setLoginDialogAsyncState: setAsyncState
    }

}