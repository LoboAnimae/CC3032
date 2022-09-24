import BasicInfoComponent from "./BasicInformation";
import Composition from "./Composition";
import { CompositionComponent, TypeComponent } from "./index";

export interface TableParams {
  parent: TableComponent | null;
}

export interface TableInstance {
  get: <T>(key: string) => T | null;
  add: (value: CompositionComponent) => void;
  [Symbol.iterator]: () => any;
  createChild: () => TableComponent;
}

class TableComponent extends Composition {
  public parent: TableComponent | null;
  public elements: CompositionComponent[];
  constructor(options?: Partial<TableParams>) {
    super({ componentName: "Table" });
    this.elements = [];
    this.parent = options?.parent ?? null;
  }
  get<T>(key: string, options?: {inCurrentScope: boolean}): T | null {
    const foundComponent = this.elements.find((element: CompositionComponent) => {
      const basicInfo = element.getComponent(BasicInfoComponent);
      const typeComponent = element.getComponent(TypeComponent);
      return basicInfo?.getName() === key || typeComponent?.name === key;
    });
    if (options?.inCurrentScope) {
      return foundComponent as T;
    }
    return (foundComponent ?? this.parent?.get<T>(key) ?? null) as T;
  }
  add(...values: (CompositionComponent | undefined)[]): void {
    for (const value of values) {
      if (!(value instanceof CompositionComponent)) {
        throw new Error("Attempting to add a non CompositionComponent to a TableComponent");
      }
      this.elements.push(value);
    }
  }

  createChild(): TableComponent {
    return new TableComponent({ parent: this });
  }
  setMethods(into: any): void {
    into.get = <T>(key: string) => this.get<T>(key);
    into.add = (value: CompositionComponent) => this.add(value);
    into.createChild = () => this.createChild();
  }

  copy(): Composition {
    return new TableComponent({ parent: this.parent });
  }

  configure(into: any): void {}

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
  components: { table: TableComponent };
}

export default TableComponent;
