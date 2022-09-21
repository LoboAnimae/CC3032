export interface Params {
  value: any;
}

export class Component {
  public value?: any;

  constructor(options?: Partial<Params>) {
    this.value = options?.value ?? null;
  }
}

export type Type = Component;

export interface Support {
  components: {
    valueHolder: Component;
  };
  getValueComponent(): Component;
  setValueComponent(newComponent: Component): void;
}
