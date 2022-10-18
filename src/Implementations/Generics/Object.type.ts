import { BasicInfoComponent, CompositionComponent, TableComponent, TypeComponent } from '../../Components';
import { MethodElement, TableElementType } from 'Implementations/DataStructures/';

import { ClassDefineContext } from 'antlr/yaplParser';
import { StringType, ClassType } from '.';

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
