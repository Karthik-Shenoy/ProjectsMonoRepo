export type Request = {
    id: string;
    path: string;
    method: string;
    payload: string;
};

export type Response = {
    status: number;
    data: string;
};

export interface HTTPService {
    sendRequest(url: string, request: Request): Promise<Response>;
}

export interface ResponseWriter {
    writeResponse(response: Response): void;
    writeHeader(header: string, value: string): void;
    writeError(error: Error): void;
}

export type BackendServiceInfo = {
    IPAddr: string;
    Port: number;
};

export interface ILoadBalancer {
    onRequest(request: Request, responseWriter: ResponseWriter): void;
}

export interface ILoggerService {
    log(...args: any[]): void;
}

export const BackendPool: BackendServiceInfo[] = [
    { IPAddr: "192.168.1.2", Port: 8080 },
    { IPAddr: "192.168.1.3", Port: 8080 },
    { IPAddr: "192.168.1.4", Port: 8080 },
    { IPAddr: "192.168.1.5", Port: 8080 },
];
