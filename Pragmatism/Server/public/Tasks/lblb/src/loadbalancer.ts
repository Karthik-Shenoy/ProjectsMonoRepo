import {
    HTTPService,
    ResponseWriter,
    Request,
    BackendServiceInfo,
    ILoadBalancer,
    ILoggerService,
} from "./contracts";

/*
!!! this is just for reference do not uncomment !!!

export type Request = {
    id: string;
    url: string;
    method: string;
    payload: string;
};

export interface HTTPService {
    sendRequest(request: Request): Promise<Response>;
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

export const BackendPool: BackendServiceInfo[] = [
    { IPAddr: "192.168.1.2", Port: 8080 },
    { IPAddr: "192.168.1.3", Port: 8080 },
    { IPAddr: "192.168.1.4", Port: 8080 },
    { IPAddr: "192.168.1.5", Port: 8080 },
];
*/

export class Loadbalancer implements ILoadBalancer {
    constructor(
        private httpService: HTTPService,
        private backendPool: BackendServiceInfo[],
        private loggerService: ILoggerService
    ) {}

    /**
     * pass the requests/responses/errors as is to the backend service and the client
     */
    public async onRequest(request: Request, responseWriter: ResponseWriter) {}
}
