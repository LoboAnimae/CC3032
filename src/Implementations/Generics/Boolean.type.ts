import { Primitive } from './Primitive.type';
import { IntType } from '.';
import { CompositionComponent, TableComponent, TypeComponent, ValueComponent } from '../../Components';

export class BoolType extends Primitive {
  static Name = 'Bool';
  static Type = 'Bool';
  static Size = 1;

  defaultValue: number = 0;
  constructor() {
    super({ name: BoolType.Name });
    this.componentName = BoolType.Name;
    this.sizeInBytes = BoolType.Size;
    this.allowsNegation = true;
    this.addComponent(new TableComponent());
  }

  clone(): BoolType {
    return new BoolType();
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    if (!typeComponent) return false;
    return [IntType.Name, BoolType.Name].includes(typeComponent.componentName);
  };

  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    if (!typeComponent) return false;
    return [IntType.Name, BoolType.Name].includes(typeComponent.componentName);
  };

  coherseType = function (value?: CompositionComponent): BoolType | null {
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    if (!typeComponent) return null;
    if (typeComponent.componentName === BoolType.Name) {
      return value as BoolType;
    } else if (typeComponent.componentName === IntType.Name) {
      const newBool = new BoolType();
      const foundValue = value!.getComponent<ValueComponent>({ componentType: ValueComponent.Type });
      if (foundValue) {
        newBool.addComponent(new ValueComponent({ value: !!foundValue.getValue() }));
      }
      return newBool;
    }
    return null;
  };
}
