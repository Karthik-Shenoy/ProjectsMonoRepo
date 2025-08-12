import * as vitest from "vitest";
import { it, expect, describe, beforeAll, beforeEach, vi } from "vitest";
import { Future } from "../src/promise";
import { LoggerService } from "../src/logger";

const puntMacroTaskQueue = () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        });
    });
};

describe("Task-Tests:Promise", () => {
    beforeAll(() => {
        Future.loggerService = new LoggerService();
    });

    vitest.afterAll(() => {
        Future.loggerService.dispose();
    });
    it("then should allow chaining promises", async () => {
        const failureHandler = vi.fn((_reason) => {});
        const successHandler = vi.fn((result) => {
            expect(result).toBe(1);
        });
        const errorHandler = vi.fn((_err) => {});

        const future = new Future((resolve, reject) => {
            throw Error("Some error occurred");
        })
            .then(successHandler, failureHandler)
            .catch(errorHandler);

        await puntMacroTaskQueue();

        expect(errorHandler).toBeCalledTimes(1);
        expect(failureHandler).not.toBeCalled();
    });
    it("should resolve value synchronously", async () => {
        const successHandler = vi.fn();
        new Future<number>((resolve) => resolve(42)).then(successHandler, vi.fn());
        await puntMacroTaskQueue();
        expect(successHandler).toBeCalledWith(42);
    });

    it("should reject with reason", async () => {
        const failureHandler = vi.fn();
        new Future<number>((_, reject) => reject("fail")).then(vi.fn(), failureHandler);
        await puntMacroTaskQueue();
        expect(failureHandler).toBeCalledWith("fail");
    });

    it("should chain multiple thens", async () => {
        const handler1 = vi.fn().mockReturnValue(2);
        const handler2 = vi.fn();
        new Future<number>((resolve) => resolve(1))
            .then(handler1, vi.fn())
            .then(handler2, vi.fn());
        await puntMacroTaskQueue();
        expect(handler1).toBeCalledWith(1);
        expect(handler2).toBeCalledWith(2);
    });

    it("should catch thrown errors from executor", async () => {
        const catchHandler = vi.fn();
        new Future<number>((resolve) => { throw new Error("exec error"); })
            .catch(catchHandler);
        await puntMacroTaskQueue();
        expect(catchHandler).toBeCalledTimes(1);
    });

    it("should catch errors thrown in successHandler", async () => {
        const catchHandler = vi.fn();
        new Future<number>((resolve) => resolve(1))
            .then(() => { throw new Error("handler error"); }, vi.fn())
            .catch(catchHandler);
        await puntMacroTaskQueue();
        expect(catchHandler).toBeCalledTimes(1);
    });

    it("should not catch rejection in catch", async () => {
        const catchHandler = vi.fn();
        new Future<number>((_, reject) => reject("fail"))
            .catch(catchHandler);
        await puntMacroTaskQueue();
        expect(catchHandler).not.toBeCalled();
    });
});
