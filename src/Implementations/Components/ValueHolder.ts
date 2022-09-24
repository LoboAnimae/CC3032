import Composition from "./Composition";

export interface ValueHolderparams {
  value: any;
}

class ValueHolderComponent extends Composition {
  public value?: any;

  constructor(options?: Partial<ValueHolderparams>) {
    super({ componentName: "ValueHolder" });
    this.value = options?.value ?? null;
  }

  getValue = () => this.value;
  setValue = (value: any) => {
    this.value = value;
  };
  copy(): Composition {
    return new ValueHolderComponent({ value: this.value });
  }

  configure(into: any): void {}

  setMethods(into: any) {
    into.getValue = this.getValue;
    into.setValue = this.setValue;
  }
}

export default ValueHolderComponent;
