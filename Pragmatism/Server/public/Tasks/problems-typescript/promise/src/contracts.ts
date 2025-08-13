
export interface ILoggerService {
    log(...args: any[]): void;
}

export enum FutureState {
    Pending,
    Resolved,
    Rejected,
    Error,
}

