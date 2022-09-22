// import { Table } from "./Table";
// import { IType } from "./Type";
// import { IValueHolder, IValueHolderParams } from "./ValueHolder";

import { BasicInfoComponent, PositioningImpl, TableImpl, TypeImpl, ValueHolderComponent } from "./Components";

/**
 * A symbol in memory. The most basic information that isn't (necessarily) generic.
 * @implements {IBasicInformation} - The basic information of the symbol
 * @implements {IPositioning} - The position of the symbol in the source code
 * @implements {IValueHolder} - The value of the symbol
 * @implements {ITypeComponent} - The type of the symbol
 */
export class SymbolElement
  implements
  BasicInfoComponent.Support,
  PositioningComponent.Support,
  ValueHolderComponent.Support,
  TypeComponent.Support {
  components: {
    basicInfo: BasicInfo.Component;
    valueHolder: ValueHolder.Component;
    position: Positioning.Component;
    type: Type.Component;
  };

  constructor() {
    this.components = {
      basicInfo: new BasicInfoComponent.Component(),
      valueHolder: new ValueHolderComponent.Component(),
      position: new PositioningImpl.Component(),
      type: new TypeImpl.Component(),
    };
  }
  getInfoComponent(): BasicInfo.Component {
    return this.components.basicInfo;
  }
  setInfoComponent(newComponent: BasicInfo.Component): void {
    this.components.basicInfo = newComponent;
  }
  getPositionComponent(): Positioning.Component {
    return this.components.position;
  }
  setPositionComponent(newComponent: Positioning.Component): void {
    this.components.position = newComponent;
  }
  getValueComponent(): ValueHolder.Component {
    return this.components.valueHolder;
  }
  setValueComponent(newComponent: ValueHolder.Component): void {
    this.components.valueHolder = newComponent;
  }
  getTypeComponent(): Type.Component {
    return this.components.type;
  }
  setTypeComponent(newComponent: Type.Component): void {
    this.components.type = newComponent;
  }
}
/**
 * A Method.
 * @implements {TableImpl} because parameters are only local to methods
 * @implements {IPositioning} - The position of the method in the source code
 * @implements {IBasicInformation} - The basic information of the method
 * @implements {ITypeComponent} - The type of the method
 */
export class MethodElement extends SymbolElement implements TableComponent.Support {
  components: {
    table: Table.Component;
    basicInfo: BasicInfo.Component;
    valueHolder: ValueHolder.Component;
    position: Positioning.Component;
    type: Type.Component;
  };
  constructor() {
    super();
    this.components = {
      table: new TableImpl.Component(),
      basicInfo: new BasicInfoComponent.Component(),
      valueHolder: new ValueHolderComponent.Component(),
      position: new PositioningImpl.Component({ line: 0, column: 0 }),
      type: new TypeImpl.Component(),
    };
  }
  getTableComponent(): Table.Component {
    if (!this.components.table) {
      throw new Error("Table component not found");
    }
    return this.components.table;
  }
  setTableComponent(newComponent: Table.Component): void {
    this.components.table = newComponent;
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
