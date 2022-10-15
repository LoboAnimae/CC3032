import { MethodContext } from '../../../antlr/yaplParser';
import {
  BasicInfoComponent,
  CompositionComponent,
  extractPositioning,
  extractTypeComponent,
  extractValueComponent,
} from '../../Components';
import ContextHolder, { extractContext } from '../../Components/ContextHolder';
import Table from '../../Components/Table';
import TableComponent, { extractTableComponent } from '../../Components/Table';
import SymbolElement, { SymbolElementParams } from './SymbolElement';
import TableElement from './TableElement';

export default class MethodElement extends TableElement {
  static Name = 'MethodElement';

  constructor(options?: SymbolElementParams) {
    super(options);
    this.componentName = MethodElement.Name;
    const newTableComponent = new TableComponent();
    this.addComponent(newTableComponent);
    this.addComponent(new ContextHolder<MethodContext>());
  }

  addParameters(...parameters: SymbolElement[]): MethodElement {
    const tableComponent = this.getComponent<TableComponent<SymbolElement>>({ componentType: Table.Type })!;
    tableComponent.add(...parameters);
    return this;
  }

  getTable(): TableComponent<SymbolElement> {
    return this.getComponent<TableComponent<SymbolElement>>({ componentType: Table.Type })!;
  }

  getParameters(): SymbolElement[] {
    const tableComponent = this.getTable();
    return tableComponent.getAll();
  }

  clone(): MethodElement {
    const typeComponent = extractTypeComponent(this)!;
    const positioningComponent = extractPositioning(this);
    const value = extractValueComponent(this)?.getValue();
    const contextHolder = extractContext(this);
    const newMethod = new MethodElement({
      type: typeComponent,
      scopeName: this.scopeName,
      column: positioningComponent?.column,
      line: positioningComponent?.line,
      memoryAddress: this.memoryAddress,
      name: this.getName(),
      value,
    });

    const table = extractTableComponent(this);
    newMethod.replaceComponent(table?.copy());

    const newContext = extractContext(newMethod)!;
    newContext.setContext(contextHolder!.getContext()!);
    return newMethod;
  }

  toString(): string {
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
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
    return `MethodComponent{${name}${elementsString}${methodsString}${elementsString || methodsString ? '\t\n' : ''}}`;
  }

  getSize = () => 0;

  toCode() {
    return `goto ${this.getName()}`;
  }
}
