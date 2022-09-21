import * as BasicInfo from "./BasicInformation";

export interface Params {
  parent: Component | null;
}

export class Component {
  public parent: Component | null;
  public elements: BasicInfo.Support[];
  constructor(options?: Partial<Params>) {
    this.elements = [];
    this.parent = options?.parent ?? null;
  }
  get(key: string): any | null {
    return (
      this.elements.find(
        (element: BasicInfo.Support) =>
          element.components.basicInfo.name === key
      ) ??
      this.parent?.get(key) ??
      null
    );
  }
  add(value: BasicInfo.Support): void {
    this.elements.push(value);
  }
}

export type Type = Component;

export interface Support {
  components: { table: Component };
  getTableComponent(): Component;
  setTableComponent(newComponent: Component): void;
}
