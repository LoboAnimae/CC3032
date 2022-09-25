import {
  BasicInfoComponent,
  CompositionComponent,
  PositioningComponent,
  TypeComponent,
  ValueHolder,
} from '../../Components';
import ComponentInformation from '../../Components/ComponentInformation';
export interface TableElementParams {
  name?: string;
  type?: CompositionComponent;
  value?: any;
  line?: number;
  column?: number;
}

export default abstract class TableElement extends CompositionComponent {
  constructor(options?: TableElementParams) {
    super();
    this.componentType = 'TableElement';
    this.unique = false;

    const basicInfo = new BasicInfoComponent({ name: options?.name });
    this.addComponent(basicInfo);

    const { Type } = ComponentInformation.components;
    const typeComponent = options?.type?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!typeComponent) throw new Error('Trying to instantiate with non-existent type');
    this.addComponent(typeComponent);

    if (options?.value) {
      this.addComponent(new ValueHolder({ value: options?.value }));
    }
    if (options?.line) {
      this.addComponent(new PositioningComponent({ line: options?.line, column: options?.column }));
    }
  }
}
