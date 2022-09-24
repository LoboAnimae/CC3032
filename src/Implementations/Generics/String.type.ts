import {
  BasicInfoComponent,
  CompositionComponent,
  TableComponent,
  TableInstance,
  TypeComponent,
  TypeInstance,
  ValueHolderComponent,
} from "../Components";
import { Method, SymbolElement } from "../DataStructures/Method.type";
import Integer from "./Integer.type";
import { Primitive } from "./Primitive.type";

export class String extends Primitive {
  static Name = "String";
  static StringType = new String();

  constructor() {
    super({ name: String.Name, sizeInBytes: 24, isGeneric: true, parent: null });
    this.addComponent(new BasicInfoComponent({ name: String.Name }));

    const tableComponent = new TableComponent();
    this.addComponent(tableComponent);

    this.configure(this);
    const lengthMethod = new Method({ name: "length", type: new Integer() });

    const concatMethod = new Method({ name: "concat", type: this }).addParameters(
      new SymbolElement({ name: "s", type: this })
    );

    const substrMethod = new Method({ name: "substr", type: this }).addParameters(
      new SymbolElement({ name: "i", type: new Integer() }),
      new SymbolElement({ name: "l", type: new Integer() })
    );

    tableComponent.add(lengthMethod, concatMethod, substrMethod);
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    return ["String"].includes(value?.componentName ?? "");
  };
  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    return ["String"].includes(value?.componentName ?? "");
  };
  coherseType = function (value?: CompositionComponent): String | null {
    if (value) {
      const newValue = new String();
      const foundValue = value.getComponent(ValueHolderComponent);
      if (foundValue) {
        newValue.addComponent(new ValueHolderComponent({ value: "" + foundValue.value }));
      }
      return newValue;
    }
    return null;
  };

  configure(into: any): void {

  }
  copy(): String {
    return new String();
  }
  setMethods(into: CompositionComponent): void {}
}


export default String;