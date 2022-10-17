import { CompositionComponent } from 'Components';

export interface ValueHolderparams {
  value: any;
}

export function extractValueComponent(inComponent?: CompositionComponent | null) {
  if (!inComponent) return null;
  return inComponent.getComponent<ValueComponent>({ componentType: ValueComponent.Type });
}

export class ValueComponent extends CompositionComponent {
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
  clone(): CompositionComponent {
    return new ValueComponent({ value: this.value });
  }
}

