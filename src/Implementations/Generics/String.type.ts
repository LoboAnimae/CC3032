import { CompositionComponent, TableComponent, TypeComponent, ValueComponent } from 'Components';
import { MethodElement, SymbolElement } from 'Implementations/DataStructures/TableElements';
import { IntType } from 'Implementations/Generics/';
import { Primitive } from './Primitive.type';

export class StringType extends Primitive {
  static Name = 'String';
  static Type = 'String';
  static Size = 24;

  defaultValue: string = '';
  constructor() {
    super({ name: StringType.Name });
    this.componentName = StringType.Name;
    this.sizeInBytes = StringType.Size;

    const tableComponent = new TableComponent();
    this.addComponent(tableComponent);

    const lengthMethod = new MethodElement({
      name: 'length',
      type: new IntType(),
      scopeName: this.componentName,
      memoryAddress: -1,
    });

    const concatMethod = new MethodElement({
      name: 'concat',
      type: this,
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    concatMethod.addParameters(
      new SymbolElement({ name: 's', type: this, scopeName: this.componentName, memoryAddress: -1 }),
    );

    const substrMethod = new MethodElement({
      name: 'substr',
      type: this,
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    substrMethod.addParameters(
      new SymbolElement({ name: 'i', type: new IntType(), scopeName: this.componentName, memoryAddress: -1 }),
      new SymbolElement({ name: 'l', type: new IntType(), scopeName: this.componentName, memoryAddress: -1 }),
    );

    tableComponent.add(lengthMethod, concatMethod, substrMethod);
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    const incomingValueComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Name });

    if (!incomingValueComponent) return false;

    return [StringType.Name].includes(incomingValueComponent.componentName);
  };
  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    const incomingValueComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Name });

    if (!incomingValueComponent) return false;

    return [StringType.Name].includes(incomingValueComponent.componentName);
  };

  coherseType = function (value?: CompositionComponent): StringType | null {
    const incomingValueTypeComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Name });
    const incomingValueComponent = value?.getComponent<ValueComponent>({ componentType: ValueComponent.Name });
    if (!incomingValueTypeComponent || !incomingValueComponent) return null;

    const newValue = new StringType();
    newValue.addComponent(new ValueComponent({ value: '' + incomingValueComponent.value }));
    return newValue;
  };

  clone(): StringType {
    return new StringType();
  }
}

export default StringType;
