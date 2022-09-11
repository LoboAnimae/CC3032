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
  Symbol,
}
export interface ITableElement {
  name: string;
  type: string;
  line: number;
  column: IPositioning;
  dataStructureType: IDataStructureType;
}

// interface IDefaultExprValues<T> {
//   allowed: boolean;
//   as: T;
// }

interface IExpressionProperties<T> {
  // boolean: IDefaultExprValues<boolean>;
  // integer: IDefaultExprValues<number>;
  // string: IDefaultExprValues<string>;
  // compared: IDefaultExprValues<any>;
  // negated: IDefaultExprValues<any>;
  // equated: IDefaultExprValues<any>;
  // compileTime: IDefaultExprValues<T>;
  type: string[];
}

/**
 * Every single expression has a type.
 */
export class Properties<T> {
  private _type: Table<any>;
  private _assignmentFunction: (input: any) => boolean;

  constructor(options: { type: Table<any> }) {
    this._type = options.type;
    this._assignmentFunction = () => false;
  }

  canCompare() {}
}

// Builder pattern may help with better understanding
export class TableElement {
  protected _name?: string;
  protected _type?: string;
  protected _line?: number = 0;
  protected _column?: IPositioning = { start: 0, end: 0 };
  protected _dataStructureType?: IDataStructureType;
  protected _scope?: string;
  protected _size?: number;

  constructor() {}

  public setScope(scope: string) {
    this._scope = scope;
    return this;
  }

  public setName(name: string) {
    this._name = name;
    return this;
  }

  public setType(type: string) {
    this._type = type;
    if (type === "Bool") {
      this._size = 1;
    } else if (type === "Int") {
      this._size = 4;
    } else if (type === "String") {
      this._size = 24;
    } else {
      this._size = 1;
    }
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

  public setSize(newSize: number) {
    this._size = newSize;
    return this;
  }

  public getScope = () => this._scope;

  public getName = () => this._name;

  public getType = () => this._type;

  public getLine = () => this._line;

  public getColumn = () => this._column;

  public getStartColumn = () => this._column?.start;

  public getEndColumn = () => this._column?.end;

  public getDataStructureType = () => this._dataStructureType;
  public getSize = () => this._size;

  public isSameName = (name: string) => this._name === name;
  public toString(): string {
    return `[${this._dataStructureType ?? "Unknown Data Type"}] ${
      this._name ?? "Unknown Name"
    } (${this._type ?? "Unknown Type"})`;
  }

  public copy(): TableElement {
    return new TableElement()
      .setName(this._name!)
      .setType(this._type!)
      .setLine(this._line!)
      .setColumn(this._column!)
      .setDataStructureType(this._dataStructureType!)
      .setScope(this._scope!);
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

interface ISymbolsTableParams<T> {
  scope?: string;
  parentTable?: Table<any>;
  line?: number;
  column?: IPositioning;
  canBeType?: boolean;
  canBeInherited?: boolean;
  isGeneric?: boolean;
  canBeComparedTo?: string[];
  defaultValue: T;
  canBeAssigned?: string[];
  allowNegation?: boolean;
  assigmentFunction?: () => (input: any, using?: any) => [boolean, string?];
  comparisonFunction?: () => (input: any, using?: any) => [boolean, string?];
  errors?: ErrorsTable;
  warnings?: ErrorsTable;
}

export class Table<T> {
  public readonly symbols: TableElement[] = [];
  public readonly scope: string;
  public readonly tableName: string;
  public readonly parentTable?: Table<any>;
  public readonly line: number;
  public readonly column: IPositioning;
  public readonly canBeType: boolean;
  public readonly canBeInherited: boolean;
  public readonly isGeneric: boolean = false;
  public readonly _canBeComparedTo: string[] = [];
  public readonly allowsComparisonsTo: (input: any) => [boolean, string?];
  public readonly canBeAssigned: string[] = [];
  public readonly defaultValue: T;
  public readonly allowsAssignmentOf: (
    input: any,
    using?: any
  ) => [boolean, string?];
  public readonly allowNegation: boolean;
  public readonly errors?: ErrorsTable;
  public readonly warnings?: ErrorsTable;
  constructor(options?: ISymbolsTableParams<T>) {
    this.scope = options?.scope ?? "global";
    this.tableName = options?.scope ?? "global";
    this.parentTable = options?.parentTable;
    this.line = options?.line ?? 0;
    this.column = options?.column || { start: 0, end: 0 };
    this.canBeInherited = options?.canBeInherited ?? true;
    this.canBeType = options?.canBeType ?? true;
    this.defaultValue = options?.defaultValue ?? ({} as T);
    this._canBeComparedTo = [
      this.tableName,
      ...(options?.canBeComparedTo ?? []),
    ];

    this.canBeAssigned = [this.tableName, ...(options?.canBeAssigned ?? [])];
    this.allowsAssignmentOf =
      options?.assigmentFunction?.().bind(this) ??
      (() => {
        throw new Error(`Assignment function not defined in ${this.tableName}`);
      });
    this.allowsComparisonsTo =
      options?.comparisonFunction?.().bind(this) ??
      (() => {
        throw new Error(`Comparison not implemented in ${this.tableName}`);
      });

    this.warnings = options?.warnings;
    this.errors = options?.errors;

    this.allowNegation = options?.allowNegation ?? false;
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
      const foundElement = this.symbols.find((symbol: TableElement) =>
        symbol.isSameName(name)
      );
      return foundElement ?? this.parentTable?.find(name);
    }
    return undefined;
  };

  equate = (name: string) => {
    return this._canBeComparedTo.includes(name);
  };

  possibleTypes = (): string[] => {
    return [
      ...this._canBeComparedTo,
      ...this.canBeAssigned,
      ...(this.parentTable?.possibleTypes() ?? []),
    ];
  };

  isOfType = (name: string): boolean => {
    if (this.tableName === name) {
      return true;
    }
    return this.parentTable?.isOfType(name) ?? false;
  };

  existsInScope = (name: string): boolean => {
    return this.find(name) !== undefined;
  };

  findInCurrentClosedScope = (
    name: string
  ): SymbolElement | MethodElement | undefined => {
    const foundElement = this.symbols.find((symbol: TableElement) =>
      symbol.isSameName(name)
    );
    if (foundElement) return foundElement;
    return undefined;
  };
  existsInCurrentClosedScope = (name: string): boolean => {
    return this.findInCurrentClosedScope(name) !== undefined;
  };

  addElement = (...newElements: TableElement[]) => {
    newElements.forEach((newElement) => {
      this.symbols.push(newElement);
    });
    return this;
  };

  getAllWithDataType = (dataType: IDataStructureType): TableElement[] => {
    const parentSymbols = this.parentTable?.getAllWithDataType(dataType) ?? [];
    const currentSymbols = [...this.symbols].filter(
      (symbol) => symbol.getDataStructureType() === dataType
    );

    for (const parentSymbol of parentSymbols) {
      if (
        currentSymbols.find((symbol) =>
          symbol.isSameName(parentSymbol.getName()!)
        )
      ) {
        continue;
      }
      currentSymbols.push(parentSymbol);
    }
    return currentSymbols;
  };

  getAllSymbols = (): SymbolElement[] =>
    this.getAllWithDataType(IDataStructureType.Symbol) as SymbolElement[];
  getAllMethods = (): MethodElement[] =>
    this.getAllWithDataType(IDataStructureType.Method) as MethodElement[];

  getAllElements = (): SymbolElement[] => {
    const allSymbols = this.getAllSymbols();
    const allMethods = this.getAllMethods();
    return [...allSymbols, ...allMethods];
  };

  get size() {
    const allElements = this.getAllSymbols();
    if (!allElements.length) return 1;
    return allElements.reduce((acc, element) => acc + element.getSize()!, 0);
  }
  public toString = (): string => {
    if (this.isGeneric || this.tableName === "Object") return "";
    return ErrorsTable.quotedErrorFormat(
      "Table: {} of size {}",
      this.scope,
      this.size
    );
  };
}

export interface IError {
  message: string;
  line: number;
  column: IPositioning;
}

export class ErrorsTable {
  public readonly errors: IError[];
  public readonly appender;
  public readonly color;
  constructor(appender = "Error", color = "41") {
    this.appender = appender;
    this.color = color;
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
    if (this.errorExists(error)) return;
    this.errors.push(error);
  };

  errorExists = (error: IError) =>
    !!this.errors.find(
      (err) =>
        err.message === error.message &&
        err.line === error.line &&
        err.column.start === error.column.start &&
        err.column.end === error.column.end
    );

  printError = (error: string, line: number, column: number) => {
    return `\x1b[${this.color}m[${this.appender}]\x1b[0m\x1b[33m[${line}:${column}]\x1b[0m ${error}`;
  };
  getErrors = () => this.errors;
  toString(): string {
    return this.errors
      .map((error) =>
        this.printError(error.message, error.line, error.column.start)
      )
      .join("\n");
  }
}
