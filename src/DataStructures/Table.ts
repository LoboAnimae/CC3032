export interface IPositioning {
  start: number;
  end: number;
}

export interface Parameter {
  name: string;
  type: string;
}
export enum IDataStructureType {
  Method,
  Symbol
}
export interface ITableElement {
  name: string;
  type: string;
  line: number;
  column: IPositioning;
  dataStructureType: IDataStructureType;
}



// Builder pattern may help with better understanding
export class TableElement {
  public _name?: string;
  public _type?: string;
  public _line?: number = 0;
  public _column?: IPositioning = { start: 0, end: 0 };
  public _dataStructureType?: IDataStructureType;

  constructor() {
  }

  public setName(name: string) {
    this._name = name;
    return this;
  }

  public setType(type: string) {
    this._type = type;
    return this;
  }

  public setLine(line: number) {
    this._line = line;
    return this;
  }

  public setColumn(column: IPositioning) {
    this._column = column;
    return this;
  }

  public setStartColumn(start: number) {

    this._column!.start = start;
    return this;
  }

  public setEndColumn(end: number) {
    this._column!.end = end;
    return this;
  }

  public setDataStructureType(dataStructureType: IDataStructureType) {
    this._dataStructureType = dataStructureType;
    return this;
  }


  public getName() {
    return this._name;
  }

  public getType() {
    return this._type;
  }

  public getLine() {
    return this._line;
  }

  public getColumn() {
    return this._column;
  }

  public getStartColumn() {
    return this._column?.start;
  }

  public getEndColumn() {
    return this._column?.end;
  }

  public getDataStructureType() {
    return this._dataStructureType;
  }


  public isSameName(name: string) {
    return this._name === name;
  }
  public toString(): string {
    if (!(this._name || this._type || this._line || this._column || this._dataStructureType)) {
      throw new Error("TableElement is not initialized");
    }
    return `[${this._dataStructureType}] ${this._name} (${this._type})`;
  }

}

export class MethodElement extends TableElement {
  public _parameters: Parameter[] = [];
  constructor() {
    super();
    this._dataStructureType = IDataStructureType.Method;
  }

  public addParameter(...parameter: Parameter[]) {
    this._parameters.push(...parameter);
    return this;
  }
  public getParameters() {
    return this._parameters;
  }

  public setReturnType(type: string) {
    return this.setType(type);
  }
}

export class SymbolElement extends TableElement {
  constructor() {
    super();
    this._dataStructureType = IDataStructureType.Symbol;
  }
}

interface ISymbolsTableParams {
  scope?: string;
  parentTable?: Table;
  line?: number;
  column?: IPositioning;
  canBeType?: boolean;
  canBeInherited?: boolean;
  isGeneric?: boolean;
}

export class Table {
  public readonly symbols: TableElement[] = [];
  public readonly scope: string;
  public readonly tableName: string;
  public readonly parentTable?: Table;
  public readonly line: number;
  public readonly column: IPositioning;
  public readonly canBeType: boolean;
  public readonly canBeInherited: boolean;
  public readonly isGeneric: boolean = false;
  constructor(options?: ISymbolsTableParams) {
    this.scope = options?.scope ?? "global";
    this.tableName = options?.scope ?? "global";
    this.parentTable = options?.parentTable;
    this.line = options?.line ?? 0;
    this.column = options?.column || { start: 0, end: 0 };
    this.canBeInherited = options?.canBeInherited ?? true;
    this.canBeType = options?.canBeType ?? true;
    if (options?.isGeneric) {
      this.canBeInherited = false;
      this.canBeType = true;
      this.isGeneric = true;
    }
  }

  /**
   * Looks up a symbol in the current scope and all parent scopes.
   * @param name The name of the symbol to look up.
   * @returns The symbol if found, otherwise undefined.
   */
  find = (name?: string): SymbolElement | MethodElement | undefined => {
    if (name) {
      const foundElement = this.symbols.find((symbol: TableElement) => symbol.isSameName(name));
      if (foundElement) return foundElement;
      if (this.parentTable) return this.parentTable.find(name);
    }
    return undefined;
  };

  existsInScope = (name: string): boolean => {
    return this.find(name) !== undefined;
  };

  addElement = (...newElements: TableElement[]) => {
    newElements.forEach(newElement => {
      const foundElement = this.find(newElement.getName());
      // Elements and methods can´t have the same name.
      if (foundElement) {
        throw new Error(`Symbol ${newElement.getName() || 'Unknown'} already exists in scope ${this.scope} as ${foundElement.getType() || 'Unknown'} type. (Defined in line ${foundElement.getLine() || 'Unknown'}, column ${foundElement.getStartColumn() || 'Unknown'} - ${foundElement.getEndColumn() || 'Unknown'})`);
      }
      this.symbols.push(newElement);
    });
    return this;
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
  static errorFormat = (errorMessage: string, ...args: any[]) => {
    let currentString = errorMessage;

    args.forEach((arg) => {
      currentString = currentString.replace(`{}`, `\x1b[33m${arg}\x1b[0m`);
    });
    return currentString;
  };

  static quotedErrorFormat = (errorMessage: string, ...args: any[]) => {
    const quotedArgs = args.map((arg) => `"${arg}"`);
    return ErrorsTable.errorFormat(errorMessage, ...quotedArgs);
  };

  addError = (error: IError) => {
    this.errors.push(error);
  };



  printError = (error: string, line: number, column: number) => {
    return `\x1b[41m[Error]\x1b[0m\x1b[33m[${line}:${column}]\x1b[0m ${error}`;
  };
  getErrors = () => this.errors;
  toString(): string {
    return this.errors.map(error => this.printError(error.message, error.line, error.column.start)).join("\n");
  };
}
