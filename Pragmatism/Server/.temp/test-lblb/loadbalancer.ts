import {
    HTTPService,
    ResponseWriter,
    Request,
    BackendServiceInfo,
    ILoadBalancer,
    ILoggerService,
} from "./contracts";


export class Loadbalancer implements ILoadBalancer {
    constructor(
        private httpService: HTTPService,
        private backendPool: BackendServiceInfo[],
        private loggerService: ILoggerService
    ) {}

    /**
     * pass the requests/responses/errors as is to the backend service and the client
     */
    public async onRequest(request: Request, responseWriter: ResponseWriter) {
        this.loggerService.log(request)
    }
}
