import Composition from "./Composition";

export interface Params {
  name: string;
}

class BasicInfoComponent extends Composition {
  public name?: string;
  constructor(options?: Partial<Params>) {
    super({ componentName: "BasicInformation" });
    this.name = options?.name;
  }

  getName = () => this.name;
  setName = (newName: string) => {
    this.name = newName;
  };

  setMethods(into: any) {
    into.getName = this.getName;
    into.setName = this.setName;
  }

  copy(): Composition {
    return new BasicInfoComponent({ name: this.name });
  }
  configure(into: any) {
    this.setMethods(into);
  }
}

/**
 * Offers support for generic information
 */
export interface Support {
  components: {
    basicInfo: BasicInfoComponent;
  };
}

export default BasicInfoComponent;
