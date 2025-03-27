import { Loadbalancer } from "../src/loadbalancer";
import { HTTPService, ResponseWriter, Request, BackendServiceInfo } from "../src/contracts";
import { LoggerService } from "../src/logger";
import { it, expect, describe, beforeAll, beforeEach, vi } from "vitest";
import * as vitest from "vitest";

describe("Task-Tests:LBLB", () => {
    let mockHTTPService: vitest.Mocked<HTTPService>;
    let mockResponseWriter: vitest.Mocked<ResponseWriter>;
    let backendPool: BackendServiceInfo[];
    let loadbalancer: Loadbalancer;
    let loggerService: LoggerService;
    let logSpy: vitest.MockInstance;

    beforeAll(() => {
        loggerService = new LoggerService();
    });

    beforeEach(() => {
        mockHTTPService = {
            sendRequest: vi.fn(),
        };

        mockResponseWriter = {
            writeResponse: vi.fn(),
            writeHeader: vi.fn(),
            writeError: vi.fn(),
        };

        backendPool = [{ IPAddr: "192.168.1.2", Port: 8080 }];
        logSpy = vi.spyOn(loggerService, "log");
        loadbalancer = new Loadbalancer(mockHTTPService, backendPool, loggerService);
    });

    it("should forward the request to a backend service", async () => {
        const request: Request = {
            id: "1",
            path: "/test",
            method: "GET",
            payload: "",
        };

        backendPool = [{ IPAddr: "192.168.1.2", Port: 8080 }];

        mockHTTPService.sendRequest.mockResolvedValueOnce({
            status: 200,
            data: "Success",
        });

        await loadbalancer.onRequest(request, mockResponseWriter);

        expect(mockHTTPService.sendRequest).toHaveBeenCalledWith(
            `http://${backendPool[0].IPAddr}:${backendPool[0].Port}/test`,
            {
                ...request,
            }
        );
        expect(mockResponseWriter.writeResponse).toHaveBeenCalledWith({
            status: 200,
            data: "Success",
        });
    });

    it("should handle errors from backend services", async () => {
        const request: Request = {
            id: "2",
            path: "/error",
            method: "POST",
            payload: "data",
        };

        const error = new Error("Backend error");
        mockHTTPService.sendRequest.mockRejectedValueOnce(error);

        await loadbalancer.onRequest(request, mockResponseWriter);

        expect(mockResponseWriter.writeError).toHaveBeenCalledWith(error);
    });

    it("should consistently map the requests to the same servers for cache affinity", async () => {
        const requests: Request[] = [];
        for (let i = 0; i < 10; i++) {
            requests.push({
                id: `${i}`,
                path: `/test/${i}`,
                method: "GET",
                payload: "",
            });
        }

        // add more backend servers
        for (let i = 0; i < 3; i++) {
            backendPool.push({
                IPAddr: `192.168.1.${i + 4}`,
                Port: 8080,
            });
        }

        // track requests to backend servers
        const backendServerRequests: { [key: string]: number } = {};
        mockHTTPService.sendRequest.mockImplementation((url, request: Request) => {
            backendServerRequests[url] = (backendServerRequests[url] || 0) + 1;
            return Promise.resolve({
                status: 200,
                data: "Success",
            });
        });

        await Promise.all(
            requests.map((request) => loadbalancer.onRequest(request, mockResponseWriter))
        );

        // send http requests evenly distributed to the backend servers
        expect(mockHTTPService.sendRequest).toHaveBeenCalledTimes(requests.length);
        let backendServersCount = 0;
        for (const url in backendServerRequests) {
            expect(backendServerRequests[url]).toBeGreaterThan(2);
            backendServersCount++;
        }
        expect(backendServersCount).toBe(backendPool.length);
    });
});
