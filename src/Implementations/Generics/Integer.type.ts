import { BasicInfo, Table, Type, ValueHolder } from "../Components/index";
import { MethodElement } from "../SymbolsTable";

export default class Integer
  extends Type.Component
  implements ValueHolder.Support, Table.Support
{
  public static Type = new Integer();

  components: { valueHolder: ValueHolder.Component; table: Table.Component };
  constructor() {
    super({
      name: "Integer",
      parent: null,
      sizeInBytes: 4,
      isGeneric: true,
    });
    this.components = {
      table: new Table.Component({ parent: null }),
      valueHolder: new ValueHolder.Component({ value: null }),
    };
  }

  getTableComponent(): Table.Component {
    return this.components.table;
  }
  setTableComponent(newComponent: Table.Component): void {
    this.components.table = newComponent;
  }
  isAncestorOf(_incomingType?: Type.Component | undefined): boolean {
    return false;
  }
  hasAsAncestor(_incomingType?: Type.Component | undefined): boolean {
    return false;
  }
  allowsAssignmentOf(incomingType?: Type.Component | undefined): boolean {
    return incomingType instanceof Integer || incomingType instanceof Boolean;
  }
  allowsComparisonTo(incomingType?: Type.Component | undefined): boolean {
    return incomingType instanceof Integer || incomingType instanceof Boolean;
  }
  coherseType(incomingType?: Type.Component, value?: any): any | null {
    if (incomingType instanceof Integer) {
      return value;
    } else if (incomingType instanceof Boolean) {
      return Number(value);
    }
    return null;
  }

  getValueComponent(): ValueHolder.Component {
    return this.components.valueHolder;
  }
  setValueComponent(newComponent: ValueHolder.Component): void {
    this.components.valueHolder = newComponent;
  }
}
