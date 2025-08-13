export namespace DTO {
    export type Task = {
        id: number;
        title: string;
        description: string;
        numSolves: number;
        markdownUrl: string;
        taskDir: string;
    };

    export type TaskSubmitRequest = {
        userName: string;
        userId: string;
        taskId: number;
        taskDir: string;
        taskFiles: TaskFile[];
        language: string;
    };

    export enum FileType {
        LIB = 0,
        TASK = 1,
    }

    export type TaskFile = {
        fileName: string;
        content: string;
        fileType: FileType;
    };

    export type GetTaskResponse = {
        taskDir: string;
        taskFiles: TaskFile[];
        markdownUrl: string;
        language: string;
    };

    export type TestResult = {
        testName: string;
        isSuccessful: boolean;
    };

    export type TaskSubmitResponse = {
        testResults: TestResult[];
        dbgLogs: string;
    };

    export type User = {
        id: string;
        name: string;
        picture: string;
    };

    export type SolvedTask = {
        title: string;
    };
}
