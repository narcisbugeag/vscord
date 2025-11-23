import { Extension } from "../extension";
import { ExtensionBasedProvider } from "./extensionBasedProvider";
import { Provider } from "./provider";

export class GitProvider extends ExtensionBasedProvider {
  public override readonly extensions: string[] = ["vscode.git"];

  constructor(extension: Extension) {
    super(extension, "git", 0);

    this.provide("git_ok", () => "ok");
  }
}
