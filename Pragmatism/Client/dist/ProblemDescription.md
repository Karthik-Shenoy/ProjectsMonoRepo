# Load balancing load balancers

The goal is to implement a `Loadbalancer` that efficiently distributes incoming HTTP requests to a pool of backend services. The `Loadbalancer` should meet the following requirements:


- We utilize **constructor injection** to provide the necessary **custom services and helpers** for solving problems. Please **leverage these pre-configured dependencies** to ensure **modular, maintainable, and test-friendly solutions**, enabling effective **automated grading and evaluation**.  

In this case, we have injected the following services via **constructor injection**:  

- **`httpService`** (implements `HTTPService`)  
  ```typescript
  export interface HTTPService {
      sendRequest(url: string, request: Request): Promise<Response>;
  }
  ```
  - Use this service to **send HTTP requests** and interact with external systems.  

- **`BackendPool[]`**  
  - Represents a **pool of backend instances** that can be used for processing requests.  

- **`loggerService`**  
  - Use this service to **log debug messages**, which can be viewed in the **debug panel** for better troubleshooting.  

Additionally, the system provides a **response writer** interface:  
```typescript
export interface ResponseWriter {
    writeResponse(response: Response): void;
    writeHeader(header: string, value: string): void;
    writeError(error: Error): void;
}
```
- Utilize this to **write responses, headers, and handle errors** efficiently.  

Make sure to **use these injected services effectively** to while solving and ensure proper **testing and grading**.


- **Request Forwarding**: The `Loadbalancer` must forward incoming HTTP requests to one of the backend services in the pool. The forwarded request should include the original request details (e.g., path, method, payload).

- **Error Handling**: If a backend service fails to process a request, the `Loadbalancer` should handle the error gracefully and return an appropriate error response to the client.

- **Cache Affinity**: The `Loadbalancer` should consistently map requests to the same backend server for cache affinity. This ensures that requests with similar characteristics are routed to the same server, improving performance and reducing redundancy.

- **Load Distribution**: The `Loadbalancer` should distribute requests evenly across all available backend services to prevent overloading any single server.
