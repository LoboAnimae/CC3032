export interface Params {
  name: string;
  parentComponent: any;
}

export class Component {
  public name?: string;
  public parentComponent?: any;
  constructor(options?: Partial<Params>) {
    this.name = options?.name;
    this.parentComponent = options?.parentComponent ?? null;
  }
}

export type Type = Component;

/**
 * Offers support for generic information
 */
export interface Support {
  components: {
    basicInfo: Component;
  };
  getInfoComponent(): Component;
  setInfoComponent(newComponent: Component): void;
}
