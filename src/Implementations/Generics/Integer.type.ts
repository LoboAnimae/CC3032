import {
  TableInstance,
  TypeInstance,
  CompositionComponent,
  BasicInfoComponent,
  TableComponent,
  TypeComponent,
  ValueHolderComponent,
} from "../Components/index";

export default class Integer extends TypeComponent {
  static Name = "Int";
  static IntegerType = new Integer();

  constructor() {
    super({ name: Integer.Name, sizeInBytes: 4, isGeneric: true, parent: null });
    this.addComponent(new BasicInfoComponent({ name: Integer.Name }));
    this.addComponent(new TableComponent());
    this.configure(this);
  }

  øallowsAssignmentOf = function (value?: CompositionComponent): boolean {
    return ["Int", "Bool"].includes(value?.componentName ?? "");
  };

  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    return ["Int", "Bool"].includes(value?.componentName ?? "");
  };

  coherseType = function (value?: CompositionComponent): Integer | null {
    if (value?.componentName === "Integer") {
      return value as Integer;
    } else if (value?.componentName === "Bool") {
      const newInteger = new Integer();
      const foundValue = value.getComponent(ValueHolderComponent);
      if (foundValue !== null) {
        newInteger.addComponent(new ValueHolderComponent({ value: Number(foundValue.getValue()) }));
      }
      return newInteger;
    }
    return null;
  };

  configure(into: any): void {

  }

  copy(): Integer {
    return new Integer();
  }

  setMethods(into: CompositionComponent): void {}
}
