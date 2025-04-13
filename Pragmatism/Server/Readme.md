### Services
- Services are singleton objects which expose specific functionalities to the main app
- Services are defined at `./internal/services` folder
- Currently we widely use singletons, seems like an anti-pattern (but we have a custom `dependency-injector` that manages lifetimes)
- Each service includes a contract folder that defines interfaces or contracts, specifying the APIs that other components can depend on.
- `Caveat`: bad workaround but models are considered as singeltonservices

### Testing
- all the service classes use dependency injection to ensure they are decoupled and easily testable

### Error handling
- we use our in-house `app-error` to create error which provide clear context and make it easy to locate where error occurred, making it easy to debug the application
    - each service defines a `private` function `getServiceOrigin` which returns the `package/service name` 
    - we concatenate the function name along with the service name, to make sure the origin of the error is traceable

### Service Injector
- need to build some sort of compile time checks 


### Creating new tasks
- To add new tasks create a problem statement, and decide on the tests
    - create the image with `task-image` prefix in it's name
    - create a docker file for the task, (don't mount volumes), we use a `copy-overwrite` approach in the containers on submit 

- tests for `typescript`
    - Initially we planned to use jest for tests, but it was too heavy for our simple use-case (more over the vanilla/babel build took most of the time)
    - we chose to stick to `vitest` which uses es-build (`written in  golang`) which is almost 10x faster than using babel/vanilla build