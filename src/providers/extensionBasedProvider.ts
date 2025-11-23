import { Extension } from "../extension";
import { Provider } from "./provider";
import { extensions } from "vscode";

export class ExtensionBasedProvider extends Provider {
    public readonly extensions: string[] = [];
    private extensionState: Record<string, boolean> = {};

    constructor(
        extension: Extension,
        public id = "base",
        public priority = 0
    ) {
        super(extension);

        this.extensionState = extensions.all
            .filter((x) => this.extensions.includes(x.id))
            .reduce(
                (x, y) => {
                    x[y.id] = y.isActive;
                    return x;
                },
                {} as Record<string, boolean>
            );

        if (Object.values(this.extensionState).some((x) => !x)) this.onExtensionDeactivate();
        else this.onExtensionActivate();

        extension.context?.subscriptions.push(
            extensions.onDidChange(() => {
                this.updateState();
            })
        );
    }

    private updateState() {
        const filtered = extensions.all.filter((x) => this.extensions.includes(x.id));

        if (filtered.every((x) => this.extensionState[x.id] === x.isActive)) return;

        const isAnyInactive = filtered.some((x) => !x.isActive);
        if (isAnyInactive) this.onExtensionDeactivate();
        else this.onExtensionActivate();
    }

    protected onExtensionActivate() {}
    protected onExtensionDeactivate() {}

    public override shouldSkip(): boolean {
        return Object.values(this.extensionState).some((x) => !x);
    }
}
