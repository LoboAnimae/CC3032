import { BasicInfoComponent, CompositionComponent, extractTypeComponent } from '../../Components';
import { ClassType } from '../../Generics/Object.type';
import TableElement from './TableElement';
export interface SymbolElementParams {
  name?: string;
  type?: CompositionComponent;
  value?: any;
  line?: number;
  column?: number;
  scopeName: string;
  memoryAddress?: number;
}

export default class SymbolElement extends TableElement {
  static Name = 'SymbolElement';
  constructor(options?: SymbolElementParams) {
    super(options);
    this.componentName = SymbolElement.Name;
  }

  clone(): CompositionComponent {
    return new SymbolElement();
  }

  toString(): string {
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
    return `SymbolElement{ scope{ ${this.scopeName} }, name{ ${basicInfo.getName()} } address { ${this.memoryAddress} } }`;
  }

  getSize = (): number => {
    const typeComponent = extractTypeComponent(this);
    return (typeComponent as ClassType)?.getSize?.() ?? typeComponent?.sizeInBytes!;
  };

  toCode(): string {
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
    const scope = this.scopeName;
    const name = basicInfo.getName();
    return `${scope}.${name}`;
  }
}
