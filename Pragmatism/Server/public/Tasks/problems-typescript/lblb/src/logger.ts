import * as fs from "fs";

const CONSOLE_LOG_FILE = "./console.log";
const FILE_MODE = 0o777

export class LoggerService {
    constructor() {
        this.clearConsole();
    }

    public dispose() {
        this.clearConsole();
    }

    public log(...args: any[]) {
        const logMsg = args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg))
            .join(" ");
        fs.appendFileSync(CONSOLE_LOG_FILE, logMsg + "\n");
    }

    private clearConsole = () => {
        fs.writeFileSync(CONSOLE_LOG_FILE, "", { mode: FILE_MODE });
    };
}
