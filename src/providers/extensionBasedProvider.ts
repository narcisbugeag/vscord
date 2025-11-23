import { extensions } from "vscode";
import { Provider } from "./provider";

export class ExtensionBasedProvider extends Provider {
  public readonly extensions: string[] = [];

  public override shouldSkip(): boolean {
    return !this.extensions.every((ext) =>
      {
        return extensions.all.some((x) => x.isActive && x.id === ext)
      }
    );
  }
}
