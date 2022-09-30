import {
  BasicInfoComponent,
  CompositionComponent,
  PositioningComponent,
  TypeComponent,
  ValueComponent,
} from '../../Components';
import ComponentInformation from '../../Components/ComponentInformation';
import {v4 as uuid} from 'uuid'
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
  constructor(options?: TableElementParams) {
    super();
    this.referentialID = uuid();
    this.componentType = 'TableElement';
    this.unique = false;
    this.scopeName = options?.scopeName ?? 'Unknown Scope'

    const basicInfo = new BasicInfoComponent({ name: options?.name });
    this.addComponent(basicInfo);

    const { Type } = ComponentInformation.components;
    const typeComponent = options?.type?.getComponent<TypeComponent>({ componentType: Type.type });
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
    const { BasicInfo } = ComponentInformation.components;
    return this.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!;
  }

  getType(): TypeComponent {
    const { Type } = ComponentInformation.components;
    return this.getComponent<TypeComponent>({ componentType: Type.type })!;
  }

  getValueHolder(): ValueComponent | null {
    const { ValueHolder } = ComponentInformation.components;
    return this.getComponent<ValueComponent>({ componentType: ValueHolder.type });
  }

  getPositioning(): PositioningComponent {
    const { Positioning } = ComponentInformation.components;
    return this.getComponent<PositioningComponent>({ componentType: Positioning.type })!;
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
}
