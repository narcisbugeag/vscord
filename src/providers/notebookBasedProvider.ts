import { Provider } from "./provider";
import { window } from "vscode";

export class NotebookBasedProvider extends Provider {
  protected get notebookEditor() {
    return window.activeNotebookEditor;
  }

  public override shouldSkip(): boolean {
    return !!!this.notebookEditor;
  }
}
