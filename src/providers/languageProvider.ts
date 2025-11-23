import { TextEditorBasedProvider } from "./textEditorBasedProvider";
import { Extension } from "../extension";

export class LanguageProvider extends TextEditorBasedProvider {
  constructor(extension: Extension) {
    super(extension, "language", 0);
  }

  protected override registerVariables() {
    this.provide(
      "language_id",
      async () => this.textEditor?.document.languageId,
    );
  }
}
