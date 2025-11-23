import { TextEditorBasedProvider } from "./textEditorBasedProvider";
import { Extension } from "../extension";

export class LanguageProvider extends TextEditorBasedProvider {
    constructor(extension: Extension) {
        super(extension, "language", 0, true);
    }

      protected override registerVariables() {
        this.provide("language_id", () => this.textEditor?.document.languageId);
    }
}