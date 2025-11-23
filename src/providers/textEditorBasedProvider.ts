import { TextEditor, window } from "vscode";
import { Provider } from "./provider";

export class TextEditorBasedProvider extends Provider {
    protected get textEditor() {
        return window.activeTextEditor;
    }

    public override shouldSkip(): boolean {
        return !!!this.textEditor;
    }
}
