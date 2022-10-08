import {
  BasicInfoComponent,
  CompositionComponent,
  TableComponent,
  TableInstance,
  TypeComponent,
  TypeInstance,
  ValueComponent,
} from '../Components';
import { MethodElement, SymbolElement } from '../DataStructures/TableElements';
import Integer from './Integer.type';
import { Primitive } from './Primitive.type';

export class StringType extends Primitive {
  static Name = 'String';
  static Type = 'String';
  defaultValue: string = '';
  constructor() {
    super({ name: StringType.Name });
    this.componentName = StringType.Name;
    this.sizeInBytes = 24;

    const tableComponent = new TableComponent();
    this.addComponent(tableComponent);

    const lengthMethod = new MethodElement({
      name: 'length',
      type: new Integer(),
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
      new SymbolElement({ name: 'i', type: new Integer(), scopeName: this.componentName, memoryAddress: -1 }),
      new SymbolElement({ name: 'l', type: new Integer(), scopeName: this.componentName, memoryAddress: -1 }),
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
