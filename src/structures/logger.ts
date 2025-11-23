import { Extension } from "../extension";
import { window } from "vscode";
import { Base } from "./base";

export class Logger extends Base {
    outputChannel = window.createOutputChannel("VSCord");

    constructor(extension: Extension) {
        super(extension);
    }

    public info(...messages: any[]) {
        this.log("[INFO]", ...messages);
    }

    public error(...messages: any[]) {
        this.log("[ERROR]", ...messages);
    }

    public warn(...messages: any[]) {
        this.log("[WARN]", ...messages);
    }

    public debug(...messages: any[]) {
        this.log("[DEBUG]", ...messages);
    }

    public log(...messages: any[]) {
        this.outputChannel.appendLine(messages.join(" "));
        // for debug console
        console.log(...messages);
    }

    public clear() {
        this.outputChannel.clear();
        console.clear();
    }
}
