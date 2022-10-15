import { v4 as uuid } from 'uuid';
import {
  BasicInfoComponent,
  CompositionComponent,
  PositioningComponent,
  TypeComponent,
  ValueComponent,
} from '../../Components';
export interface TableElementParams {
  name?: string;
  type?: CompositionComponent;
  value?: any;
  line?: number;
  column?: number;
  scopeName: string; // Just to help us
}

export default abstract class TableElement extends CompositionComponent {
  referentialID: string;
  scopeName: string;
  memoryAddress: number = -1;
  constructor(options?: TableElementParams) {
    super();
    this.referentialID = uuid();
    this.componentType = 'TableElement';
    this.unique = false;
    this.scopeName = options?.scopeName ?? 'Unknown Scope';
    this.memoryAddress = -1;
    const basicInfo = new BasicInfoComponent({ name: options?.name });
    this.addComponent(basicInfo);

    const typeComponent = options?.type?.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
    if (!typeComponent) throw new Error('Trying to instantiate with non-existent type');
    this.addComponent(typeComponent);

    if (options?.value) {
      this.addComponent(new ValueComponent({ value: options?.value }));
    }
    if (options?.line) {
      this.addComponent(new PositioningComponent({ line: options?.line, column: options?.column }));
    }
  }

  getBasicInfo(): BasicInfoComponent {
    return this.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type })!;
  }

  getType(): TypeComponent {
    return this.getComponent<TypeComponent>({ componentType: TypeComponent.Type })!;
  }

  getValueHolder(): ValueComponent | null {
    return this.getComponent<ValueComponent>({ componentType: ValueComponent.Type });
  }

  getPositioning(): PositioningComponent {
    return this.getComponent<PositioningComponent>({ componentType: PositioningComponent.Type })!;
  }

  getLine(): number {
    const positioningComponent = this.getPositioning();
    return positioningComponent.line ?? -1;
  }

  getColumn(): number {
    const positioningComponent = this.getPositioning();
    return positioningComponent.column ?? -1;
  }

  getName(): string {
    const basicInfo = this.getBasicInfo();
    return basicInfo.getName() ?? 'Unknown name';
  }

  setAddress(newAddress: number): void {
    this.memoryAddress = newAddress;
  }

  offsetAddressBy(p_offset: number): number {
    this.memoryAddress += p_offset;
    return this.memoryAddress;
  }

  abstract toCode(): string;
}
