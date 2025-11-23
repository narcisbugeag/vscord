import { LanguageProvider } from "./providers/languageProvider";
import { JupyterProvider } from "./providers/jupyterProvider";
import { type ExtensionContext, Disposable, window } from "vscode";
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

    // Temporary debug code
    setInterval(() => {
      this.logger.debug(
        "file name ->",
        this.providerManager.resolveVariable("file_name")
      );
            this.logger.debug(
        "language id ->",
        this.providerManager.resolveVariable("language_id")
      );
      this.logger.debug(
        "is git ok?",
        this.providerManager.resolveVariable("git_ok")
      );
      this.logger.debug(
        "unknown value",
        this.providerManager.resolveVariable("gserersthiuwaerhuiarwehu")
      );
    }, 1000);
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
