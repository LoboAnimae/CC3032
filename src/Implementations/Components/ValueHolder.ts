import ComponentInformation from './ComponentInformation';
import Composition from './Composition';

export interface ValueHolderparams {
  value: any;
}

class ValueHolder extends Composition {
  public value?: any;

  constructor(options?: Partial<ValueHolderparams>) {
    super();

    const ValueHolderInfo = ComponentInformation.components.ValueHolder;
    this.componentName = ValueHolderInfo.name;
    this.componentType = ValueHolderInfo.type;
    this.value = options?.value ?? null;
  }

  getValue = () => this.value;
  setValue = (value: any) => {
    this.value = value;
  };
  clone(): Composition {
    return new ValueHolder({ value: this.value });
  }
}

export default ValueHolder;
