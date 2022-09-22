import * as BasicInfo from "./BasicInformation";
import Composition from "./Composition";

export interface TableParams {
  parent: TableImpl | null;
}

export interface TableComponent {
  get: <T>(key: string) => T | null;
  add: (value: BasicInfo.BasicInfoComponent) => void;
  [Symbol.iterator]: () => any;
}

class TableImpl extends Composition {
  public parent: TableImpl | null;
  public elements: BasicInfo.BasicInfoComponent[];
  constructor(options?: Partial<TableParams>) {
    super({ componentName: "Table" });
    this.elements = [];
    this.parent = options?.parent ?? null;
  }
  get<T>(key: string): T | null {
    return (
      this.elements.find(
        (element: BasicInfo.BasicInfoComponent) =>
          element.getName() === key
      ) ??
      this.parent?.get(key) ??
      null
    ) as T;
  }
  add(value: BasicInfo.BasicInfoComponent): void {
    this.elements.push(value);
  }

  setMethods(into: any): void {
    into.get = <T>(key: string) => this.get<T>(key);
    into.add = (value: BasicInfo.BasicInfoComponent) => this.add(value);
  }


  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.elements.length) {
          return {
            value: this.elements[index++],
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  }

}


export interface TableSupport {
  components: { table: TableImpl; };
}

export default TableImpl;
