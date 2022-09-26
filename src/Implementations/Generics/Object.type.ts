import { MethodElement, SymbolElement, TableElementType } from '../DataStructures/TableElements';
import {
  BasicInfoComponent,
  CompositionComponent,
  ITableGetOptions,
  TableComponent,
  TypeComponent,
} from '../Components';
import ComponentInformation from '../Components/ComponentInformation';

import StringType from './String.type';
import TableElement from '../DataStructures/TableElements/TableElement';
interface ClassTypeParams {
  name: string;
  parentType?: TypeComponent | null;
  basicComponent: BasicInfoComponent;
  typeComponent: TypeComponent;
}

export class ObjectType extends TypeComponent {
  constructor(options?: Partial<ClassTypeParams>) {
    super();

    const { Object: ObjectType } = ComponentInformation.type;
    this.componentName = ObjectType.name;
    this.sizeInBytes = 1;
    this.isGeneric = false;
    this.parent = null;

    const basicInfo = new BasicInfoComponent({ name: ObjectType.name });
    this.addComponent(basicInfo);
    const tableComponent = new TableComponent<TableElementType>();

    const abortMethod = new MethodElement({ name: 'abort', type: this });
    const typeNameMethod = new MethodElement({ name: 'type_name', type: new StringType() });
    const copyMethod = new MethodElement({ name: 'copy', type: this });

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

  createChild: () => ClassType = () => {
    const newObject = new ClassType();
    const { Type, Table } = ComponentInformation.components;
    const tableComponent = newObject.getComponent<TableComponent<TableElementType>>({ componentType: Table.name })!;
    const typeComponent = newObject.getComponent<TypeComponent>({ componentType: Type.name })!;
    tableComponent.parent = this.getComponent<TableComponent<TableElementType>>({ componentType: Table.name })!;
    typeComponent.parent = this.getComponent<TypeComponent>({ componentType: Type.name })!;
    return newObject;
  };

  allowsAssignmentOf = (value?: CompositionComponent): boolean => {
    const { type } = ComponentInformation.components.Type;
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: type });
    if (!typeComponent) return false;
    const entireHierarchyComponents = typeComponent.getHierarchy();
    const { BasicInfo } = ComponentInformation.components;
    const entireHierarchyNames = entireHierarchyComponents
      .map((t) => t.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })?.getName())
      .filter((n) => !!n);
    return entireHierarchyNames.includes(
      this.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })?.getName(),
    );
  };

  clone(): CompositionComponent {
    return new ObjectType();
  }

  toString(): string {
    const { type } = ComponentInformation.components.BasicInfo;
    return `<Primitive> ${this.getComponent<BasicInfoComponent>({ componentType: type })?.getName()}`;
  }
}

export class ClassType extends ObjectType {
  constructor(options?: Partial<ClassTypeParams>) {
    super();
    const { Class, BasicInfo } = ComponentInformation.components;
    this.componentName = Class.name;
    this.parent = options?.parentType ?? null;
    this.isGeneric = false;
    this.sizeInBytes = 0;

    const { Table } = ComponentInformation.components;
    const parentTable =
      options?.parentType?.getComponent<TableComponent<TableElement>>({ componentType: Table.type }) ?? null;

    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!;
    basicInfo.setName(options?.name ?? Class.name);

    const tableComponent = this.getComponent<TableComponent<TableElement>>({ componentType: Table.type })!;
    tableComponent.parent = parentTable;
  }

  getType(): TypeComponent {
    const { Type } = ComponentInformation.components;
    return this.getComponent<TypeComponent>({ componentType: Type.type })!;
  }

  getBasicInfo(): BasicInfoComponent {
    const { BasicInfo } = ComponentInformation.components;
    return this.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!;
  }

  getName(): string {
    const basicInfoComponent = this.getBasicInfo();
    return basicInfoComponent.getName() ?? 'Unknown Class Name';
  }

  getTable(): TableComponent<TableElementType> {
    const { Table } = ComponentInformation.components;
    return this.getComponent<TableComponent<TableElementType>>({ componentType: Table.type })!;
  }

  getElement(name: string, options?: ITableGetOptions): TableElement | null {
    const { Table } = ComponentInformation.components;
    const tableComponent = this.getComponent<TableComponent<TableElementType>>({ componentType: Table.type });
    if (!tableComponent) return null;
    return tableComponent.get(name, options);
  }

  clone(): CompositionComponent {
    return new ClassType();
  }

  getSize(): number {
    return this.sizeInBytes || 1;
  }
  toString(): string {
    const { type } = ComponentInformation.components.BasicInfo;
    return `<${this.componentName}> ${this.getComponent<BasicInfoComponent>({ componentType: type })?.getName()}`;
  }
}
