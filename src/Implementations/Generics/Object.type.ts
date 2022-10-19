
import { StringType } from './String.type';
import { TableElementType, MethodElement, TableElement } from '..';
import { ClassDefineContext } from '../../antlr/yaplParser';
import { TypeComponent, BasicInfoComponent, TableComponent, CompositionComponent, extractTableComponent, ITableGetOptions } from '../../Components';

export interface ClassTypeParams {
  name: string;
  parentType?: TypeComponent | null;
  basicComponent: BasicInfoComponent;
  typeComponent: TypeComponent;
}

export interface ClassTypeRequiredParams {
  context: ClassDefineContext;
}

export class ObjectType extends TypeComponent {
  static Name = 'Object';
  static Type = 'Object';
  constructor(options?: Partial<ClassTypeParams>) {
    super();

    this.componentName = ObjectType.Name;
    this.sizeInBytes = 1;
    this.isGeneric = false;
    this.parent = null;

    const basicInfo = new BasicInfoComponent({ name: ObjectType.Name });
    this.addComponent(basicInfo);
    const tableComponent = new TableComponent<TableElementType>();

    const abortMethod = new MethodElement({
      name: 'abort',
      type: this,
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    const typeNameMethod = new MethodElement({
      name: 'type_name',
      type: new StringType(),
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    const copyMethod = new MethodElement({
      name: 'copy',
      type: this,
      scopeName: this.componentName,
      memoryAddress: -1,
    });

    tableComponent.add(abortMethod, typeNameMethod, copyMethod);
    this.addComponent(tableComponent);
  }

  allowsComparisonTo = (_incomingType?: CompositionComponent | undefined): boolean => {
    return false;
  };
  coherseType = (_incomingType?: CompositionComponent | undefined, value?: any) => {
    if (this.allowsAssignmentOf(_incomingType)) {
      return value as ObjectType;
    } else return null;
  };

  createChild: (context: ClassDefineContext) => ClassType = (context: ClassDefineContext) => {
    const newObject = new ClassType({ context });
    const tableComponent = newObject.getComponent<TableComponent<TableElementType>>({
      componentType: TableComponent.Name,
    })!;
    const typeComponent = newObject.getComponent<TypeComponent>({ componentType: TypeComponent.Name })!;
    tableComponent.parent = this.getComponent<TableComponent<TableElementType>>({
      componentType: TableComponent.Name,
    })!;
    typeComponent.parent = this.getComponent<TypeComponent>({ componentType: TypeComponent.Name })!;
    return newObject;
  };

  allowsAssignmentOf = (value?: CompositionComponent): boolean => {
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    if (!typeComponent) return false;
    const entireHierarchyComponents = typeComponent.getHierarchy();
    const entireHierarchyNames = entireHierarchyComponents
      .map((t) => t.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })?.getName())
      .filter((n) => !!n);
    return entireHierarchyNames.includes(
      this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })?.getName(),
    );
  };

  clone(): CompositionComponent {
    return new ObjectType();
  }

  toString(): string {
    return `<Primitive> ${this.getComponent<BasicInfoComponent>({
      componentType: BasicInfoComponent.Type,
    })?.getName()}`;
  }
}



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

    const parentTable =
      options?.parentType?.getComponent<TableComponent<TableElement>>({ componentType: TableComponent.Type }) ?? null;

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
    if (!tableComponent) return null;
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
        if (element.componentName === MethodElement.Name) return 0;
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

