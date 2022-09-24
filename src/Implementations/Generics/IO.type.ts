import {
  BasicInfoComponent,
  CompositionComponent,
  TableComponent,
  TypeComponent,
} from "../Components";
import { Method, SymbolElement } from "../DataStructures/Method.type";
import Integer from "./Integer.type";
import { Primitive } from "./Primitive.type";
import String from "./String.type";

export class IO extends Primitive {
  static Name = "IO";
  static IOType = new IO();

  constructor() {
    super({ name: IO.Name, sizeInBytes: 1, isGeneric: false, parent: null });
    this.addComponent(new BasicInfoComponent({ name: IO.Name }));

    const tableComponent = new TableComponent();
    this.addComponent(tableComponent);

    const outStringMethod = new Method({ name: "out_string", type: this }).addParameters(
      new SymbolElement({ name: "x", type: new String() })
    );

    const outIntMethod = new Method({ name: "out_int", type: this }).addParameters(
      new SymbolElement({ name: "x", type: new Integer() })
    );

    const inStringMethod = new Method({ name: "in_string", type: new String() });

    const inIntMethod = new Method({ name: "in_int", type: new Integer() });

    tableComponent.add(outStringMethod, outIntMethod, inStringMethod, inIntMethod);
  }

  configure(into: any): void {}
  copy(): IO {
    return new IO();
  }
  setMethods(into: CompositionComponent): void {}
}
