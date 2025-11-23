import { NotebookBasedProvider } from "./notebookBasedProvider";
import { Extension } from "../extension";

export class JupyterProvider extends NotebookBasedProvider {
  constructor(extension: Extension) {
    super(extension, "jupyter", 1);
  }
}
