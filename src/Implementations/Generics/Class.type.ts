import {
  BasicInfoComponent,
  CompositionComponent,
  extractTableComponent,
  ITableGetOptions,
  TableComponent,
  TypeComponent
} from 'Components';
import { MethodElement, TableElementType } from '../DataStructures/TableElements';
import { ClassDefineContext } from 'antlr/yaplParser';
import TableElement from '../DataStructures/TableElements/TableElement';
import { ObjectType, ClassTypeParams, ClassTypeRequiredParams } from './Object.type';


export class ClassType extends ObjectType {
  static Name = 'Class';
  static Type = 'Class';

  ctx: ClassDefineContext;

  constructor(options: Partial<ClassTypeParams> & ClassTypeRequiredParams) {
    super();
    this.ctx = options.context;
    this.componentName = options?.name ?? ClassType.Name;
    this.parent = options?.parentType ?? null;
    this.isGeneric = false;

    const parentTable = options?.parentType?.getComponent<TableComponent<TableElement>>({ componentType: TableComponent.Type }) ?? null;

    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
    basicInfo.setName(options?.name ?? ClassType.Name);

    const tableComponent = this.getComponent<TableComponent<TableElement>>({ componentType: TableComponent.Type })!;
    tableComponent.parent = parentTable;
  }
  getType = (): TypeComponent => {
    return this.getComponent<TypeComponent>({ componentType: TypeComponent.Type })!;
  };

  getBasicInfo = (): BasicInfoComponent => {
    return this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
  };

  getName = (): string => {
    const basicInfoComponent = this.getBasicInfo();
    return basicInfoComponent.getName() ?? 'Unknown Class Name';
  };

  getTable = (): TableComponent<TableElementType> => {
    return this.getComponent<TableComponent<TableElementType>>({ componentType: TableComponent.Type })!;
  };

  getElement = (name: string, options?: ITableGetOptions): TableElement | null => {
    const tableComponent = this.getComponent<TableComponent<TableElementType>>({ componentType: TableComponent.Type });
    if (!tableComponent)
      return null;
    return tableComponent.get(name, options);
  };

  clone(): CompositionComponent {
    return new ClassType({ context: this.ctx, name: this.getName(), parentType: this.parent });
  }

  getSize = (): number => {
    const tableComponent = extractTableComponent<TableElementType>(this)!;

    const size: number = tableComponent
      .getAll(false)
      .map((element: TableElementType) => {
        if (element.componentName === MethodElement.Name)
          return 0;
        return element.getSize();
      })
      .reduce((a, b) => a + b);
    return size;
  };

  toString = (): string => {
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
    const prepender = `<${ClassType.Name}>`;
    const name = basicInfo.getName();
    const thisTable = extractTableComponent(this)!;
    const elements = thisTable.elements
      .filter((el) => el.componentName === 'SymbolElement')
      .map((el) => el.toString())
      .join('\n\t');
    const methods: string = thisTable.elements
      .filter((el) => el.componentName === 'MethodElement')
      .map((el) => el.toString())
      .join('\n\t');
    const elementsString = elements.length ? `\n\t${elements}` : '';
    const methodsString = methods.length ? `\n\t${methods}` : '';
    return `${prepender} ${name}${elementsString}${methodsString}`;
  };
}
