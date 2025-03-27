## Design overview

### How Tas submissions are handled at scale ?
- Each problem needs it's own container
    - we don't want the containers to be up all the time
    - we will have container up using a LRU cache, kill the one's at the bottom to reduce load
        - 20 Container at LRU
    - Global queues for tasks
        - Local queues for the containers
        - as soon as a container get's freed, it is killed off and other's get to make progress, based on the incoming task
    - Send busy message if user running tests for a problem,
- Rate limit concurrent tasks per user

- Queue Worker architecture with containers
- Throughput and latency
- Rate limiting
