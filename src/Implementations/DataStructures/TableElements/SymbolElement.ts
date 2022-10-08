import {
  BasicInfoComponent,
  CompositionComponent
} from '../../Components';
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
    return `SymbolElement{ scope{ ${this.scopeName} }, name{ ${basicInfo.getName()} } }`;
  }

  toCode(): string {
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
    const scope = this.scopeName;
    const name = basicInfo.getName();
    return `${scope}.${name}`;
  }
}
