enum FutureState {
    Pending,
    Resolved,
    Rejected,
    Error,
}

export class Future<T> {
    private futureState: FutureState;

    private result: T | undefined;
    private failureReason: any;
    private error: Error | undefined;

    private chainedSuccessCallback: ((result: T) => void) | undefined;
    private chainedFailureCallback: ((reason: any) => void) | undefined;
    private chainedOnErrorCallback: ((error: Error) => void) | undefined;

    constructor(executorFn: (resolve: (result: T) => void, reject: (reason: any) => void) => void) {
        this.futureState = FutureState.Pending;
        try {
            executorFn(this.onSuccess, this.onFailure);
        } catch (e) {
            this.onError(e as Error);
        }
    }

    private onSuccess = (result: T) => {
        this.futureState = FutureState.Resolved;
        this.result = result;
        this.chainedSuccessCallback?.(result);
    };

    private onFailure = (reason: any) => {
        this.futureState = FutureState.Rejected;
        this.failureReason = reason;
        this.chainedFailureCallback?.(reason);
    };

    protected onError = (err: Error) => {
        this.futureState = FutureState.Error;
        this.error = err;
        this.chainedOnErrorCallback?.(err);
    };

    public then<U>(successHandler: (result: T) => U, failureHandler: (reason: any) => void) {
        const chainedFuture = new Future<U>((resolve, reject) => {
            try {
                if (this.futureState == FutureState.Pending) {
                    this.chainedSuccessCallback = (result) => {
                        const nextResult = successHandler(result);
                        resolve(nextResult);
                    };
                    this.chainedFailureCallback = (reason) => {
                        failureHandler(reason);
                        reject(reason);
                    };
                } else if (this.futureState == FutureState.Resolved) {
                    queueMicrotask(() => {
                        const nextResult = successHandler(this.result!);
                        resolve(nextResult);
                    });
                } else if (this.futureState == FutureState.Rejected) {
                    queueMicrotask(() => {
                        failureHandler(this.failureReason);
                        reject(this.failureReason);
                    });
                } else if (this.futureState == FutureState.Error) {
                    throw this.error
                }
            } catch (e) {
                chainedFuture.onError(e as Error);
            }
        });
        return chainedFuture;
    }

    public catch<U>(failureHandler: (err: Error) => U) {
        return new Future<U>((resolve, reject) => {
            try {
                if (this.futureState == FutureState.Pending) {
                    this.chainedOnErrorCallback = () => {
                        const nextResult = failureHandler(this.error!);
                        resolve(nextResult);
                    };
                } else if (this.futureState == FutureState.Error) {
                    const nextResult = failureHandler(this.error!);
                    resolve(nextResult);
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}

new Future<void>((resolve) => {
    setTimeout(() => resolve(), 1000);
}).catch((err) => {
    console.log(err);
    return;
});
