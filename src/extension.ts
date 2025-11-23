import { LanguageProvider } from "./providers/languageProvider";
import { JupyterProvider } from "./providers/jupyterProvider";
import { type ExtensionContext, Disposable } from "vscode";
import { FileProvider } from "./providers/fileProvider";
import { GitProvider } from "./providers/gitProvider";
import { Provider } from "./providers/provider";
import { Logger } from "./structures/logger";
import { ProviderManager } from "./managers/providerManager";

export class Extension extends Disposable {
  providerManager = new ProviderManager(this);
  context: ExtensionContext | undefined;
  logger = new Logger(this);

  activated = false;

  constructor() {
    super(() => {
      this.dispose();
    });

    this.providerManager.createProvider(LanguageProvider);
    this.providerManager.createProvider(FileProvider);
    this.providerManager.createProvider(JupyterProvider);
    this.providerManager.createProvider(GitProvider);
  }

  public activate(ctx: ExtensionContext) {
    this.context = ctx;
    this.providerManager.subscribe();
    this.logger.info("VSCord is activated!");
    this.activated = true;

    setInterval(() => {
      this.logger.info("is git ok?", this.providerManager.resolveVariable("git_ok"))
    }, 1000)
  }

  public deactivate() {
    this.dispose();
    this.activated = false;
  }

  public dispose() {
    for (const subscription of this.context?.subscriptions ?? []) {
      subscription.dispose();
    }
  }
}
