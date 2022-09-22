import Composition from "./Composition";

export interface Params {
  name: string;
}

export interface BasicInfoComponent {
  getName: () => string;
  setName: (name: string) => void;
}

class BasicInfoImpl extends Composition {
  public name?: string;
  constructor(options?: Partial<Params>) {
    super({ componentName: 'BasicInformation' });
    this.name = options?.name;
  }

  setMethods(into: any) {
    into.getName = () => this.name;
    into.setName = (name: string) => {
      this.name = name;
    };
  }
}


/**
 * Offers support for generic information
 */
export interface Support {
  components: {
    basicInfo: BasicInfoImpl;
  };

}

export default BasicInfoImpl;

