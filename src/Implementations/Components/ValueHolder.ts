import Composition from './Composition';

export interface ValueHolderparams {
  value: any;
}

export function extractValueComponent(inComponent?: Composition | null) {
  if (!inComponent) return null;
  return inComponent.getComponent<ValueComponent>({ componentType: ValueComponent.Type });
}

class ValueComponent extends Composition {
  public value?: any;
  static Name = 'ValueHolder';
  static Type = 'ValueHolder';

  constructor(options?: Partial<ValueHolderparams>) {
    super();

    this.componentName = ValueComponent.Name;
    this.componentType = ValueComponent.Type;
    this.value = options?.value ?? null;
  }

  getValue = () => this.value;
  setValue = (value: any) => {
    this.value = value;
  };
  clone(): Composition {
    return new ValueComponent({ value: this.value });
  }
}

export default ValueComponent;
