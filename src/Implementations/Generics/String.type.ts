import { BasicInfoComponent, TableImpl, TypeImpl, ValueHolderComponent } from "../Components";
import { MethodElement } from "../SymbolsTable";

export class String
  extends TypeImpl.Component
  implements ValueHolderComponent.Support, TableComponent.Support {
  components: { valueHolder: ValueHolder.Component; table: Table.Component; };
  constructor() {
    super({
      name: "String",
      parent: null,
      sizeInBytes: 4,
      isGeneric: true,
    });
    this.components = {
      valueHolder: new ValueHolderComponent.Component(),
      table: new TableImpl.Component(),
    };

    const lengthMethod = new MethodElement();
    const lengthInfoComponent = lengthMethod.getInfoComponent();
    lengthInfoComponent.componentName = "length";
  }
  getTableComponent(): Table.Component {
    return this.components.table;
  }
  setTableComponent(newComponent: Table.Component): void {
    this.components.table = newComponent;
  }
  isAncestorOf(incomingType?: Type.Component | undefined): boolean {
    return false;
  }
  hasAsAncestor(incomingType?: Type.Component | undefined): boolean {
    return false;
  }
  allowsAssignmentOf(incomingType?: Type.Component | undefined): boolean {
    return incomingType instanceof String;
  }
  allowsComparisonTo(incomingType?: Type.Component | undefined): boolean {
    return incomingType instanceof String;
  }
  coherseType(incomingType?: Type.Component | undefined, value?: any) {
    return "" + null;
  }

  getValueComponent(): ValueHolder.Component {
    return this.components.valueHolder;
  }
  setValueComponent(newComponent: ValueHolder.Component): void {
    this.components.valueHolder = newComponent;
  }
}
