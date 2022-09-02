export interface IPositioning {
  start: number;
  end: number;
}

export interface Parameter {
  name: string;
  type: string;
}

export interface TableElement {
  name: string;
  type: string;
  line: number;
  column: IPositioning;
}

export interface SymbolElement extends TableElement {}

export interface MethodElement extends TableElement {
  parameters: Parameter[];
}

interface ISymbolsTableParams {
  scope?: string;
  parentTable?: Table;
  line: number;
  column: IPositioning;
}

export class Table {
  public readonly symbols: SymbolElement[] = [];
  public readonly scope: string;
  public readonly tableName: string;
  public readonly parentTable?: Table;
  public readonly line: number;
  public readonly column: IPositioning;
  constructor(options?: ISymbolsTableParams) {
    this.scope = options?.scope ?? "global";
    this.tableName = options?.scope ?? "global";
    this.parentTable = options?.parentTable;
    this.line = options?.line ?? 0;
    this.column = options?.column || { start: 0, end: 0 };
  }

  addMethod = () => {};
  addSymbol = () => {};

  /**
   * Looks up a symbol in the current scope and all parent scopes.
   * @param name The name of the symbol to look up.
   * @returns The symbol if found, otherwise undefined.
   */
  find = (name: string): SymbolElement | MethodElement | undefined => {
    const foundElement = this.symbols.find((symbol: TableElement) => symbol.name === name);
    if (foundElement) return foundElement;
    if (this.parentTable) return this.parentTable.find(name);
    return undefined;
  };
}

export interface IError {
  message: string;
  line: number;
  column: IPositioning;
}

export class ErrorsTable {
  public readonly errors: IError[];
  constructor() {
    this.errors = [];
  }

  addError = (error: IError) => {
    this.errors.push(error);
  };

  getErrors = () => this.errors;
}
