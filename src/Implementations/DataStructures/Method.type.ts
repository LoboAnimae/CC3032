import {
  BasicInfoComponent,
  CompositionComponent,
  PositioningComponent,
  TableComponent,
  TypeComponent,
  ValueHolderComponent,
} from "../Components/index";

export interface SymbolElementParams {
  name: string;
  type: CompositionComponent;
  value?: any;
  line?: number;
  column?: number;
}

export class SymbolElement extends CompositionComponent {
  constructor(options: SymbolElementParams) {
    super({ componentName: options.name });
    const basicInfo = new BasicInfoComponent({ name: options.name });
    const typeComponent = options.type
    basicInfo.configure(this);
    typeComponent.configure(this);
    if (!typeComponent) {
      throw new Error("Trying to instantiate with non-existent type");
    }
    this.addComponent(basicInfo).addComponent(typeComponent);

    if (options.value) {
      this.addComponent(new ValueHolderComponent({ value: options.value }));
    }
    if (options.line) {
      this.addComponent(new PositioningComponent({ line: options.line, column: options.column }));
    }
  }

  copy(): CompositionComponent {
    const nameComponent = this.getComponent(BasicInfoComponent)
    const typeComponent = this.getComponent(TypeComponent)
    const newComponent = new SymbolElement({ name: nameComponent!.getName()!, type: typeComponent! });
    const valueComponent = this.getComponent(ValueHolderComponent)
    const positionComponent = this.getComponent(PositioningComponent)

    newComponent.addComponent(valueComponent?.copy())?.addComponent(positionComponent?.copy());

    return newComponent;
  }
  setMethods(into: CompositionComponent): void {}
  configure(into: any): void {}
}

export class Method extends SymbolElement {
  constructor(options: SymbolElementParams) {
    super(options);
    this.addComponent(new TableComponent());
  }

  addParameters(...parameters: SymbolElement[]): Method {
    this.getComponent(TableComponent)!.add(...parameters);
    return this;
  }

  copy(): CompositionComponent {
    const basicInfoComponent = this.getComponent(BasicInfoComponent);
    const typeComponent = this.getComponent(TypeComponent);
    const valueHolderComponent = this.getComponent(ValueHolderComponent);
    const positionComponent = this.getComponent(PositioningComponent);
    const tableComponent = this.getComponent(TableComponent);
    return new Method({
      name: basicInfoComponent!.getName()!,
      type: typeComponent!,
    })
      .addComponent(valueHolderComponent)
      .addComponent(positionComponent)
      .addComponent(tableComponent);
  }

  toString(): string {
    return `<Method> ${this.getComponent(BasicInfoComponent)!.getName()}`;
  }

  configure(into: any): void {}
  setMethods(into: CompositionComponent): void {}
}
