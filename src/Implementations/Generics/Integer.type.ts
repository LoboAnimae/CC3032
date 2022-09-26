import ComponentInformation from '../Components/ComponentInformation';
import { BasicInfoComponent, CompositionComponent, TypeComponent, ValueComponent } from '../Components/index';
import { Primitive } from './Primitive.type';

export default class IntType extends Primitive {
  defaultValue: number = 0;
  constructor() {
    const { Integer } = ComponentInformation.type;
    super({ name: Integer.name });
    this.componentName = Integer.name;
    this.sizeInBytes = 4;
    this.allowsNegation = true;
    // Don't set the type here, so that it ends up being a type itself
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    const { Integer, Bool } = ComponentInformation.type;
    const { type } = ComponentInformation.components.Type;
    const valueType = value?.getComponent<TypeComponent>({ componentType: type });
    if (!valueType) return false;
    return [Integer.name, Bool.name].includes(valueType.componentName);
  };

  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    const { Integer, Bool } = ComponentInformation.type;
    const { type } = ComponentInformation.components.Type;
    const valueType = value?.getComponent<TypeComponent>({ componentType: type });
    return [Integer.name, Bool.name].includes(valueType?.componentName ?? '');
  };

  coherseType = function (value?: CompositionComponent): IntType | null {
    if (!value) return null;
    const { Integer, Bool } = ComponentInformation.type;

    if (value.componentName === Integer.name) {
      return value as IntType;
    } else if (value?.componentName === Bool.name) {
      const ValueHolderType = ComponentInformation.components.ValueHolder.type;
      const newInt = new IntType();
      const foundValue = value.getComponent<ValueComponent>({
        componentType: ValueHolderType,
      });
      if (foundValue) {
        newInt.addComponent(new ValueComponent({ value: Number(foundValue.getValue()) }));
      }
      return newInt;
    }
    return null;
  };

  clone(): IntType {
    return new IntType();
  }
}
