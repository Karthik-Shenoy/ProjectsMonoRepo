# Load balancing load balancers

The goal is to implement a `Loadbalancer` that efficiently distributes incoming HTTP requests to a pool of backend services. The `Loadbalancer` should meet the following requirements:

1. **Request Forwarding**: The `Loadbalancer` must forward incoming HTTP requests to one of the backend services in the pool. The forwarded request should include the original request details (e.g., path, method, payload).

2. **Error Handling**: If a backend service fails to process a request, the `Loadbalancer` should handle the error gracefully and return an appropriate error response to the client.

3. **Cache Affinity**: The `Loadbalancer` should consistently map requests to the same backend server for cache affinity. This ensures that requests with similar characteristics are routed to the same server, improving performance and reducing redundancy.

4. **Load Distribution**: The `Loadbalancer` should distribute requests evenly across all available backend services to prevent overloading any single server.
