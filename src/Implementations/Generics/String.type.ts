import {
  BasicInfoComponent,
  CompositionComponent,
  TableComponent,
  TableInstance,
  TypeComponent,
  TypeInstance,
  ValueComponent,
} from '../Components';
import ComponentInformation from '../Components/ComponentInformation';
import { MethodElement, SymbolElement } from '../DataStructures/TableElements';
import Integer from './Integer.type';
import { Primitive } from './Primitive.type';

export class StringType extends Primitive {
  defaultValue: string = '';
  constructor() {
    const { String } = ComponentInformation.type;
    super({ name: String.name });
    this.componentName = String.name;
    this.sizeInBytes = 24;

    const tableComponent = new TableComponent();
    this.addComponent(tableComponent);

    const lengthMethod = new MethodElement({ name: 'length', type: new Integer() });

    const concatMethod = new MethodElement({ name: 'concat', type: this });
    concatMethod.addParameters(new SymbolElement({ name: 's', type: this }));

    const substrMethod = new MethodElement({ name: 'substr', type: this });
    substrMethod.addParameters(
      new SymbolElement({ name: 'i', type: new Integer() }),
      new SymbolElement({ name: 'l', type: new Integer() }),
    );

    tableComponent.add(lengthMethod, concatMethod, substrMethod);
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    const { String } = ComponentInformation.type;
    const { Type } = ComponentInformation.components;
    const incomingValueComponent = value?.getComponent<TypeComponent>({ componentType: Type.name });

    if (!incomingValueComponent) return false;

    return [String.name].includes(incomingValueComponent.componentName);
  };
  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    const { String } = ComponentInformation.type;
    const { Type } = ComponentInformation.components;
    const incomingValueComponent = value?.getComponent<TypeComponent>({ componentType: Type.name });

    if (!incomingValueComponent) return false;

    return [String.name].includes(incomingValueComponent.componentName);
  };

  coherseType = function (value?: CompositionComponent): StringType | null {
    const { Type, ValueHolder: ValueHolderInfo } = ComponentInformation.components;

    const incomingValueTypeComponent = value?.getComponent<TypeComponent>({ componentType: Type.name });
    const incomingValueComponent = value?.getComponent<ValueComponent>({ componentType: ValueHolderInfo.name });
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
