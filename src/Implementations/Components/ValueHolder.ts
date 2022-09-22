import Composition from './Composition';

export interface ValueHolderparams {
  value: any;
}

export interface ValueHolderComponent {
  getValue: () => any;
  setValue: (value: any) => void;
}

class ValueHolderImpl extends Composition {
  public value?: any;

  constructor(options?: Partial<ValueHolderparams>) {
    super({ componentName: 'ValueHolder' });
    this.value = options?.value ?? null;
  }



  setMethods(into: any) {
    into.getValue = () => this.value;
    into.setValue = (value: any) => {
      this.value = value;
    };
  }
}


export default ValueHolderImpl;