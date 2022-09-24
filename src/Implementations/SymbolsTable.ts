// import { Table } from "./Table";
// import { IType } from "./Type";
// import { IValueHolder, IValueHolderParams } from "./ValueHolder";

import {
  BasicInfoComponent,
  CompositionComponent,
  PositioningComponent,
  TableComponent,
  TypeComponent,
  ValueHolderComponent,
} from "./Components/index";

/*
 * A Method.
 * @implements {TableComponent} because parameters are only local to methods
 * @implements {IPositioning} - The position of the method in the source code
 * @implements {IBasicInformation} - The basic information of the method
 * @implements {ITypeComponent} - The type of the method
 */
export class SymbolsTable extends TableComponent {
  elements: CompositionComponent[] = [];
  configure(into: any): void {}
  constructor() {
    super();
    this.addComponent(new BasicInfoComponent({ name: "SymbolsTable" }));
    this.componentName = "SymbolsTable";
  }

  setMethods(into: CompositionComponent): void {}

  add(...values: CompositionComponent[]): void {
    for (const value of values) {
      if (!(value instanceof CompositionComponent)) {
        throw new Error("Attempting to add a non CompositionComponent to a TableComponent");
      }
      this.elements.push(value);
    }
  }

  copy(): CompositionComponent {
    const newTable = new SymbolsTable();
    newTable.addComponent(this.getComponent(BasicInfoComponent)!.copy());
    return newTable;
  }
}

// /**
//  * A Class.
//  * @implements {Table} because methods and symbols are local to classes and their parents
//  * @implements {IBasicInformation} - The basic information of the class
//  * @implements {IPositioning} - The position of the class in the source code
//  */
// export class ClassElement
//   implements IBasicInformationSupport, TableSupport, ITypeSupport {}
