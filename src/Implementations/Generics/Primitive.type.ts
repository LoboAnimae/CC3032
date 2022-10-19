import { BasicInfoComponent, TypeComponent, ValueComponent } from '../../Components';

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
    return (
      this.getComponent<ValueComponent>({ componentType: ValueComponent.Type })?.getValue() ?? this.defaultValue ?? null
    );
  };

  createChild: () => TypeComponent = () => {
    throw new Error('Cannot create child of primitive type');
  };

  toString(): string {
    return `Primitive{ ${this.getComponent<BasicInfoComponent>({
      componentType: BasicInfoComponent.Type,
    })?.getName()} }`;
  }
}
