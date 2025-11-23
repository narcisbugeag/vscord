import { Provider } from "../providers/provider";
import { Base } from "../structures/base";

export class ProviderManager extends Base {
  providers: Provider[] = [];

  public subscribe() {
    for (const provider of this.providers) {
      provider.subscribe();
    }
  }

  public createProvider(cl: typeof Provider) {
    this.addProvider(new cl(this.extension));
  }

  public addProvider(provider: Provider) {
    this.providers.push(provider);
    this.providers.sort((a, b) => a.priority - b.priority);
    if (this.extension.activated) provider.subscribe();
  }

  public resolveVariable(name: string): string | undefined {
    for (const provider of this.providers) {
      this.extension.logger.debug(
        `Searching variable \`${name}\`, trying ${provider.id}`
      );
      this.extension.logger.debug(
        `${provider.id}'s should skip -> ${provider.shouldSkip()}`
      );
      if (provider.shouldSkip()) continue;
      if (!provider.hasVariable(name)) continue;
      const value = provider.resolveVariable(name);
      if (value) return value;
    }
  }
}
