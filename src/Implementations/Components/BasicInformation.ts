import ComponentInformation from './ComponentInformation';
import Composition from './Composition';

export interface Params {
  name: string;
  address: number;
}

export function extractBasicInformation(inComponent?: Composition | null) {
  if (!inComponent) return null;
  const { BasicInfo } = ComponentInformation.components;
  return inComponent.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type });
}

class BasicInfoComponent extends Composition {
  public name?: string;
  public address: number;
  constructor(options?: Partial<Params>) {
    super();
    const { BasicInfo } = ComponentInformation.components;
    this.componentName = BasicInfo.name;
    this.componentType = BasicInfo.type;
    this.name = options?.name;
    this.address = options?.address ?? -1;
  }

  getName = () => this.name;
  setName = (newName: string) => {
    this.name = newName;
  };

  getAddress = () => this.address;
  setAddress = (newAddress: number) => {
    this.address = newAddress;
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
