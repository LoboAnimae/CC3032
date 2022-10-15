import {
  BasicInfoComponent,
  CompositionComponent,
  extractBasicInformation,
  extractPositioning,
  extractTypeComponent,
  extractValueComponent,
} from '../../Components';
import { ClassType } from '../../Generics/Object.type';
import TableElement from './TableElement';
export interface SymbolElementParams {
  name?: string;
  type: CompositionComponent;
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
    this.memoryAddress = options?.memoryAddress ?? -1;
  }

  clone(): SymbolElement {
    const typeComponent = extractTypeComponent(this)!;
    const basicInfo = extractBasicInformation(this)!;
    const positioningComponent = extractPositioning(this);
    const value = extractValueComponent(this)?.getValue();
    console.log(this.memoryAddress);
    return new SymbolElement({
      scopeName: this.scopeName,
      type: typeComponent,
      name: basicInfo.getName(),
      column: positioningComponent?.column,
      line: positioningComponent?.line,
      memoryAddress: this.memoryAddress,
      value,
    });
  }

  toString(): string {
    const basicInfo = extractBasicInformation(this);
    return `${basicInfo?.getName()}{${this.toAddress()}}`;
    // const basicInfo = this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
    // return `SymbolElement{ scope{ ${
    //   this.scopeName
    // } }, name{ ${basicInfo.getName()} } address { 0x${this.memoryAddress.toString(16)} } }`;
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

  setMemoryAddress = (address: number) => {
    this.memoryAddress = address;
  };
  getMemoryAddress = () => this.memoryAddress;
  toAddress = () => `0x${this.memoryAddress.toString(16)}`;
}
