import {
  BasicInfoComponent,
  CompositionComponent,
  PositioningComponent,
  TypeComponent,
  ValueComponent,
} from '../../Components';
import ComponentInformation from '../../Components/ComponentInformation';
import TableElement from './TableElement';
export interface SymbolElementParams {
  name?: string;
  type?: CompositionComponent;
  value?: any;
  line?: number;
  column?: number;
  scopeName: string;
  memoryAddress: number;
}

export default class SymbolElement extends TableElement {
  constructor(options?: SymbolElementParams) {
    super(options);
    this.componentName = 'SymbolElement';
    this.memoryAddress = options?.memoryAddress ?? 0;
  }

  clone(): CompositionComponent {
    return new SymbolElement();
  }

  toString(): string {
    const { BasicInfo } = ComponentInformation.components;
    const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!;
    return `<*${this.memoryAddress}> ${basicInfo.getName()}`;
  }
}
