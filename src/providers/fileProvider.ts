import { TextEditorBasedProvider } from "./textEditorBasedProvider";
import { Extension } from "../extension";

export class FileProvider extends TextEditorBasedProvider {
  constructor(extension: Extension) {
    super(extension, "file", 0);
  }

  protected override registerVariables() {
    this.provide("file_path", async () => this.textEditor?.document.fileName);
  }
}
