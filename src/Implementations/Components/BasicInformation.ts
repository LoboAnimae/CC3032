import ComponentInformation from './ComponentInformation';
import Composition from './Composition';

export interface Params {
  name: string;
}

export function extractBasicInformation(inComponent?: Composition | null) {
  if (!inComponent) return null;
  const { BasicInfo } = ComponentInformation.components;
  return inComponent.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type });
}

class BasicInfoComponent extends Composition {
  public name?: string;
  constructor(options?: Partial<Params>) {
    super();
    const { BasicInfo } = ComponentInformation.components;
    this.componentName = BasicInfo.name;
    this.componentType = BasicInfo.type;
    this.name = options?.name;
  }

  getName = () => this.name;
  setName = (newName: string) => {
    this.name = newName;
  };

  clone(): BasicInfoComponent {
    return new BasicInfoComponent({ name: this.name });
  }
}

/**
 * Offers support for generic information
 */
export interface Support {
  components: { basicInfo: BasicInfoComponent };
}

export default BasicInfoComponent;
