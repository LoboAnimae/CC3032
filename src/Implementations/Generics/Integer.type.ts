import { CompositionComponent, TypeComponent, ValueComponent } from '../Components/index';
import BoolType from './Boolean.type';
import { Primitive } from './Primitive.type';

export default class IntType extends Primitive {
  static Name = 'Int';
  static Type = 'Int';
  static Size = 4;

  defaultValue: number = 0;
  constructor() {
    super({ name: IntType.Name });
    this.componentName = IntType.Name;
    this.sizeInBytes = IntType.Size;
    this.allowsNegation = true;
    // Don't set the type here, so that it ends up being a type itself
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    const valueType = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    if (!valueType) return false;
    return [IntType.Name, BoolType.Name].includes(valueType.componentName);
  };

  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    const valueType = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    return [IntType.Name, BoolType.Name].includes(valueType?.componentName ?? '');
  };

  coherseType = function (value?: CompositionComponent): IntType | null {
    if (!value) return null;

    if (value.componentName === IntType.Name) {
      return value as IntType;
    } else if (value?.componentName === BoolType.Name) {
      const newInt = new IntType();
      const foundValue = value.getComponent<ValueComponent>({
        componentType: ValueComponent.Type,
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
