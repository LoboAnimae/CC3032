import BasicInfoComponent from '../Components/BasicInformation';
import ComponentInformation from '../Components/ComponentInformation';
import TypeComponent from '../Components/Type';
import ValueComponent from '../Components/ValueHolder';

export abstract class Primitive extends TypeComponent {
  readonly parent = null;
  readonly isGeneric = true;
  abstract defaultValue: any;
  constructor(options: { name: string }) {
    super();
    this.componentName = 'Primitive';
    const basicInfo = new BasicInfoComponent({ name: options.name });
    this.addComponent(basicInfo);
  }

  getValue = (): any => {
    const { ValueHolder: ValueHolderInfo } = ComponentInformation.components;
    return (
      this.getComponent<ValueComponent>({ componentType: ValueHolderInfo.type })?.getValue() ??
      this.defaultValue ??
      null
    );
  };

  createChild: () => TypeComponent = () => {
    throw new Error('Cannot create child of primitive type');
  };

  toString(): string {
    const { type } = ComponentInformation.components.BasicInfo;
    return `<Primitive> ${this.getComponent<BasicInfoComponent>({ componentType: type })?.getName()}`;
  }
}
