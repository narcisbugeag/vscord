import { type ExtensionContext, commands, Disposable, extensions, workspace } from "vscode";
import { LanguageProvider } from "./providers/languageProvider";
import { JupyterProvider } from "./providers/jupyterProvider";
import { ProviderManager } from "./managers/providerManager";
import { FileProvider } from "./providers/fileProvider";
import { GitProvider } from "./providers/gitProvider";
import { Logger } from "./structures/logger";

const getConfig = () => workspace.getConfiguration("vscord");

export class Extension extends Disposable {
    providerManager = new ProviderManager(this);
    context: ExtensionContext | undefined;
    logger = new Logger(this);
    public get config() {
        return getConfig();
    }

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

        // Register commands
        ["vscord.enable", "vscord.disable"]
            .map((x) => {
                return commands.registerCommand(x, () => this.onCommand(x));
            })
            .forEach((x) => this.context?.subscriptions.push(x));

        [
            workspace.onDidChangeConfiguration(() => {
                // TODO: Call update to RPC

                if (!this.config.get<boolean>("enabled", true)) {
                    // TODO: Disable RPC
                }
            }),
            workspace.onDidChangeNotebookDocument(() => {
                // TODO: Call update to RPC
            }),
            workspace.onDidChangeNotebookDocument(() => {
                // TODO: Call update to RPC
            }),

            extensions.onDidChange(() => {
                // TODO: Call update to RPC
            })
        ].forEach((x) => ctx.subscriptions.push(x));
    }

    public onCommand(name: string) {
        switch (name) {
            case "vscord.enable":
            case "vscord.disable":
                this.config.update("enabled", name === "vscord.enable", false);
                break;
            default:
                this.logger.error(`Invalid command! ${name}`);
        }
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
