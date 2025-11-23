import { Base } from "../structures/base";
import { Extension } from "../extension";

/**
 * Provider is the main way for VSCord to figure out what variable name corospond to what
 */

export class Provider extends Base {
  public activated = false;
  private variables = new Map<string, () => Promise<string | undefined>>();

  constructor(
    extension: Extension,
    public id = "base",
    public priority = 0,
  ) {
    super(extension);
    this.registerVariables();
  }

  public subscribe() {
    return;
  }

  public shouldSkip(): boolean {
    return true;
  }

  public hasVariable(name: string): boolean {
    return this.variables.has(name);
  }

  public async resolveVariable(name: string): Promise<string | undefined> {
    return this.variables.has(name)
      ? await this.variables.get(name)!()
      : undefined;
  }

  protected registerVariables() {}

  protected async provide(
    name: string,
    value: () => Promise<string | undefined>,
  ) {
    this.variables.set(name, value);
  }
}
