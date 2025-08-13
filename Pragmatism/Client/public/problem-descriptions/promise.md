# Promise from scratch
## Background
JavaScript’s Promise is a powerful abstraction for handling asynchronous operations. Under the hood, a Promise has an internal state (pending, fulfilled, or rejected), stores a value or reason, and executes registered callbacks when settled. In this problem, you will design your own Promise-like class from scratch, following the Promises/A+ specification.

### Your Task
Design and implement a class MyPromise in JavaScript that works like the built-in Promise. Your implementation should support:

### Core States
- pending: initial state, neither fulfilled nor rejected.
- fulfilled: operation completed successfully, with a value.
- rejected: operation failed, with a reason.

### Executor Function
The constructor should accept an executor function (resolve, reject) => {} that runs immediately and can call:

- resolve(value) → moves state from pending to fulfilled with value.
- reject(reason) → moves state from pending to rejected with reason.
- Chaining with .then()
- .then(onFulfilled, onRejected) should return a new promise.
- Must handle asynchronous resolution (callbacks run in the next microtask).
- Must propagate values and errors through chains.

### Error Handling
If an error is thrown inside the executor or a .then callback, the promise should reject.
- .catch() and .finally()
- .catch(onRejected) should behave like .then(null, onRejected).
- .finally(callback) should execute callback regardless of fulfillment or rejection, without modifying the original value or reason.