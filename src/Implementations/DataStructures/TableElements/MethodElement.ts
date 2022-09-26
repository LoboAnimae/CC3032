import { BasicInfoComponent, CompositionComponent, PositioningComponent, TypeComponent } from '../../Components';
import ComponentInformation from '../../Components/ComponentInformation';
import TableComponent from '../../Components/Table';
import SymbolElement, { SymbolElementParams } from './SymbolElement';
import TableElement from './TableElement';

export default class MethodElement extends TableElement {
  constructor(options?: SymbolElementParams) {
    super(options);
    this.componentName = 'MethodElement';
    const newTableComponent = new TableComponent();
    this.addComponent(newTableComponent);
  }

  addParameters(...parameters: SymbolElement[]): MethodElement {
    const { Table } = ComponentInformation.components;
    const tableComponent = this.getComponent<TableComponent<SymbolElement>>({ componentType: Table.type })!;
    tableComponent.add(...parameters);

    return this;
  }

  getTable(): TableComponent<SymbolElement> {
    const { Table } = ComponentInformation.components;
    return this.getComponent<TableComponent<SymbolElement>>({ componentType: Table.type })!;
  }

  getParameters(): SymbolElement[] {
    const tableComponent = this.getTable();
    return tableComponent.getAll();
  }

  clone(): CompositionComponent {
    return new MethodElement();
  }

  toString(): string {
    const { BasicInfo } = ComponentInformation.components;
    return `<Method> ${this.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!.getName()}`;
  }
}
