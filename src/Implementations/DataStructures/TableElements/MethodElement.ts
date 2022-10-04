import { BasicInfoComponent, CompositionComponent, PositioningComponent, TypeComponent } from '../../Components';
import ComponentInformation from '../../Components/ComponentInformation';
import TableComponent, { extractTableComponent } from '../../Components/Table';
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
    const { type } = ComponentInformation.components.BasicInfo;
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: type })!;
    const prepender = `<${this.componentName}>`;
    const name = basicInfo.getName();
    const thisTable = extractTableComponent(this)!;
    const elements = thisTable.elements
      .filter((el) => el.componentName === 'SymbolElement')
      .map((el) => el.toString())
      .join('\n\t\t');
    const methods: string = thisTable.elements
      .filter((el) => el.componentName === this.componentName)
      .map((el) => el.toString())
      .join('\n\t\t');
    const elementsString = elements.length ? `\n\t\t${elements}` : '';
    const methodsString = methods.length ? `\n\t\t${methods}` : '';
    return `${prepender} ${name}${elementsString}${methodsString}`;
  }
}
