import BasicInfoComponent from './BasicInformation';
import ComponentInformation from './ComponentInformation';
import Composition from './Composition';
import { CompositionComponent, extractTypeComponent, TypeComponent } from './index';

export interface TableParams<T extends CompositionComponent> {
  parent: TableComponent<T> | null;
}

export interface ITableGetOptions {
  inCurrentScope?: boolean;
}

export interface TableInstance<T extends CompositionComponent> {
  get: (key: string) => T | null;
  add: (value: T) => void;
  [Symbol.iterator]: () => any;
  createChild: () => TableComponent<T>;
}

export function extractTableComponent<T extends CompositionComponent>(inComponent?: Composition | null) {
  if (!inComponent) return null;
  const { Table } = ComponentInformation.components;
  return inComponent.getComponent<TableComponent<T>>({ componentType: Table.type });
}

class TableComponent<T extends CompositionComponent> extends Composition {
  public parent: TableComponent<T> | null;
  public elements: T[];
  public size: number;
  constructor(options?: Partial<TableParams<T>>) {
    super();

    const { Table } = ComponentInformation.components;
    this.componentName = Table.name;
    this.componentType = Table.type;

    this.elements = [];
    this.parent = options?.parent ?? null;
    this.size = 0;
  }

  /**
   * Looks up a value in the table
   * @param key The name of the value in the symbols table
   * @param options
   * @returns The symbol or null
   */
  get(p_key: any, options?: ITableGetOptions): T | null {
    const key = p_key.toString();
    const { BasicInfo } = ComponentInformation.components;
    const foundComponent = this.elements.find((element: T) => {
      const basicInfo = element.getComponent<BasicInfoComponent>({
        componentType: BasicInfo.type,
      });
      return basicInfo?.getName() === key;
    });

    if (options?.inCurrentScope) {
      return (foundComponent as T) ?? null;
    }
    return (foundComponent ?? this.parent?.get(key) ?? null) as T;
  }

  getAll(): T[] {
    return [...this.elements];
  }

  /**
   * Adds new values to the table
   * @param values
   */
  add(...values: (T | undefined)[]): void {
    for (const value of values) {
      const typeComponent = extractTypeComponent(value);
      const size = typeComponent?.sizeInBytes;
      if (size) this.size += size;
      this.elements.push(value as T);
    }
  }

  clone(): Composition {
    const newTable = new TableComponent({ parent: this.parent });
    for (const element of this.elements) {
      newTable.add(element.clone() as T);
    }
    return newTable;
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

export interface TableSupport<T extends CompositionComponent> {
  components: { table: T };
}

export default TableComponent;
