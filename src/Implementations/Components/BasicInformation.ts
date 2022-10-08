import Composition from './Composition';

export interface Params {
  name: string;
  address: number;
}

export function extractBasicInformation(inComponent?: Composition | null) {
  if (!inComponent) return null;
  return inComponent.getComponent<BasicInfoComponent>({ componentType: BasicInfoComponent.Type });
}

class BasicInfoComponent extends Composition {
  static Name = 'BasicInformation';
  static Type = 'BasicInformation';
  public name?: string;
  constructor(options?: Partial<Params>) {
    super();
    this.componentName = BasicInfoComponent.Name;
    this.componentType = BasicInfoComponent.Type;
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
