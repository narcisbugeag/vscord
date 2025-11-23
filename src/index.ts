import { Extension } from "./extension";
import * as vscode from "vscode";

export const extension = new Extension();

export function activate(ctx: vscode.ExtensionContext) {
    extension.activate(ctx);
}

export function deactivate() {
    extension.deactivate();
}
