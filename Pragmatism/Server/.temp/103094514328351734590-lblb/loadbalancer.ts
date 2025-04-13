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
        const requestId = parseInt(request.id)
        const numServices = this.backendPool.length;

        const forwardingIdx = requestId % numServices
        this.loggerService.log(forwardingIdx)
        const forwardingUrl = this.getUrl(this.backendPool[forwardingIdx], request.path);
        
        try {
            let response = await this.httpService.sendRequest(forwardingUrl, request)
            responseWriter.writeResponse(response)
        }  catch (err) {
            responseWriter.writeError(err as Error)
        }

        
    }

    private getUrl(info: BackendServiceInfo, reqPath: string) {
        return `http://${info.IPAddr}:${info.Port}${reqPath}`
    }
}
