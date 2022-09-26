import { BasicInfoComponent, CompositionComponent, TableComponent, TypeComponent, ValueComponent } from '../Components';
import ComponentInformation from '../Components/ComponentInformation';
import { Primitive } from './Primitive.type';

export default class BoolType extends Primitive {
  defaultValue: boolean = false;
  constructor() {
    const { Bool } = ComponentInformation.type;
    super({ name: Bool.name });
    this.componentName = Bool.name;
    this.sizeInBytes = 1;
    this.allowsNegation = true;
    this.addComponent(new TableComponent());
  }

  clone(): BoolType {
    return new BoolType();
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    const { type } = ComponentInformation.components.Type;
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: type });
    if (!typeComponent) return false;

    const { Integer, Bool } = ComponentInformation.type;
    return [Integer.name, Bool.name].includes(typeComponent.componentName);
  };

  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    const { type } = ComponentInformation.components.Type;
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: type });
    if (!typeComponent) return false;

    const { Integer, Bool } = ComponentInformation.type;
    return [Integer.name, Bool.name].includes(typeComponent.componentName);
  };

  coherseType = function (value?: CompositionComponent): BoolType | null {
    const { type } = ComponentInformation.components.Type;
    const typeComponent = value?.getComponent<TypeComponent>({ componentType: type });
    if (!typeComponent) return null;

    const { Integer, Bool } = ComponentInformation.type;
    if (typeComponent.componentName === Bool.name) {
      return value as BoolType;
    } else if (typeComponent.componentName === Integer.name) {
      const newBool = new BoolType();

      const valueHolderType = ComponentInformation.components.ValueHolder.type;
      const foundValue = value!.getComponent<ValueComponent>({
        componentType: valueHolderType,
      });
      if (foundValue) {
        newBool.addComponent(new ValueComponent({ value: !!foundValue.getValue() }));
      }
      return newBool;
    }
    return null;
  };
}
