import BasicInfoComponent, { extractBasicInformation } from './BasicInformation';
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
  return inComponent.getComponent<TableComponent<T>>({ componentType: TableComponent.Type });
}

export function replaceTableComponent<T extends CompositionComponent>(inComponent?: Composition | null) {
  if (!inComponent) return null;
  return inComponent.replaceComponent(inComponent);
}

class TableComponent<T extends CompositionComponent> extends Composition {
  static Name = 'Table';
  static Type = 'Table';

  public parent: TableComponent<T> | null;
  public elements: T[];
  constructor(options?: Partial<TableParams<T>>) {
    super();

    this.componentName = TableComponent.Name;
    this.componentType = TableComponent.Type;

    this.elements = [];
    this.parent = options?.parent ?? null;
  }

  /**
   * Looks up a value in the table
   * @param key The name of the value in the symbols table
   * @param options
   * @returns The symbol or null
   */
  get(p_key: any, options?: ITableGetOptions): T | null {
    const key = p_key.toString();
    const foundComponent = this.elements.find((element: T) => {
      const basicInfo = element.getComponent<BasicInfoComponent>({
        componentType: BasicInfoComponent.Type,
      });
      return basicInfo?.getName() === key;
    });

    if (options?.inCurrentScope) {
      return (foundComponent as T) ?? null;
    }
    return (foundComponent ?? this.parent?.get(key) ?? null) as T;
  }

  getAll(inScope: boolean = true): T[] {
    if (inScope) return [...this.elements];
    const parentElements = this.parent?.getAll() ?? [];
    const thisElements = [...this.elements];
    const elements = [...thisElements];
    for (const element of parentElements) {
      const basicInfo = extractBasicInformation(element)!;

      if (elements.find((element) => extractBasicInformation(element)!.getName() === basicInfo.getName())) {
        continue;
      }
      elements.push(element);
    }
    return elements;
  }

  /**
   * Adds new values to the table
   * @param values
   */
  add(...values: (T | undefined)[]): void {
    for (const value of values) {
      this.elements.push(value as T);
    }
  }

  clone(): Composition {
    const newTable = new TableComponent({ parent: this.parent });
    for (const element of this.elements) {
      newTable.add(element.copy() as T);
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
  components: { table: T; };
}

export default TableComponent;
