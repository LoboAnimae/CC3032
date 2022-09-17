import { IScopeComponent } from "./Scope.interface";

export enum IPropertyType {
  Method,
  Symbol,
}

export function newTableElement(
  options: Partial<ITableElement> & {
    type: ITableComponent;
    scope: ITableComponent;
    size: number;
  }
): ITableElement {
  return {
    name: options.name ?? "",
    type: options.type!,
    propertyType: options.propertyType ?? IPropertyType.Symbol,
    line: options.line ?? -1,
    column: options.column ?? -1,
    size: options.size!,
    parameters: [...(options.parameters ?? [])],
    scope: options.scope,
  };
}

export interface ITableElement {
  name: string;
  type: ITableComponent;
  propertyType: IPropertyType;
  line: number;
  column: number;
  size: number;
  parameters: ITableElement[];
  scope: ITableComponent;
}

export interface IScopeOptions {
  inCurrentScopeOnly: boolean;
}

export interface ITableComponent {
  name: string;
  elements: ITableElement[];
  get(name: string, options?: IScopeOptions): ITableElement | undefined;
  exists(name: string, options?: IScopeOptions): boolean;
  add(...element: ITableElement[]): void;
  size: number;
}
