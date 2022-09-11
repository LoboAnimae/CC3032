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

interface IDefaultExprValues<T> {
  allowed: boolean;
  as: T;
}

interface IExpressionProperties<T> {
  boolean: IDefaultExprValues<boolean>;
  integer: IDefaultExprValues<number>;
  string: IDefaultExprValues<string>;
  compared: IDefaultExprValues<any>;
  negated: IDefaultExprValues<any>;
  equated: IDefaultExprValues<any>;
  compileTime: IDefaultExprValues<T>;
  type: string[];
}

export class Properties<T> {
  private _boolean: IDefaultExprValues<boolean>;
  private _integer: IDefaultExprValues<number>;
  private _string: IDefaultExprValues<string>;
  private _compared: IDefaultExprValues<string[]>;
  private _negated: IDefaultExprValues<any>;
  private _equated: IDefaultExprValues<string[]>;
  private _compileTime: IDefaultExprValues<T>;
  private _type: string[];
  private _assignmentFunction: (input: any) => boolean;

  constructor(options: { type: string[] }) {
    this._boolean = { allowed: false, as: false };
    this._integer = { allowed: false, as: 0 };
    this._string = { allowed: false, as: "" };
    this._compared = { allowed: false, as: [] };
    this._negated = { allowed: false, as: undefined };
    this._equated = { allowed: false, as: [] };
    this._compileTime = { allowed: false, as: undefined as T };
    this._type = options.type;
    this._assignmentFunction = (_input) => false;
  }

  //#region Getters
  get canBeBoolean(): boolean {
    return this._boolean.allowed;
  }
  get asBoolean(): boolean {
    if (!this._boolean.allowed) {
      throw new Error("Cannot convert property to boolean");
    }
    return this._boolean.as;
  }
  get canBeInteger(): boolean {
    return this._integer.allowed;
  }
  get asInteger(): number {
    if (!this._integer.allowed) {
      throw new Error("Cannot convert property to integer");
    }
    return this._integer.as;
  }

  get canBeString(): boolean {
    return this._string.allowed;
  }
  get asString(): string {
    if (!this._string.allowed) {
      throw new Error("Cannot convert property to string");
    }
    return this._string.as;
  }
  get canBeNegated(): boolean {
    return this._negated.allowed;
  }

  canBeEquatedTo(to: string): boolean {
    return this._equated.allowed && this._equated.as.includes(to);
  }

  get resolvedAtCompileTime(): boolean {
    return this._compileTime.allowed;
  }

  get type(): string[] {
    return this._type;
  }
  //#endregion

  //#region BuilderFunctions
  allowBoolean = (withCast: boolean): Properties<T> => {
    const asBool = Boolean(withCast);
    this._boolean = { allowed: true, as: asBool };
    return this;
  };

  allowInteger = (withCast: number): Properties<T> => {
    const asInt = Number(withCast);
    this._integer = { allowed: true, as: asInt };
    return this;
  };

  allowString = (withCast: string): Properties<T> => {
    const asString = String(withCast);
    this._string = { allowed: true, as: asString };
    return this;
  };

  allowNegated = (): Properties<T> => {
    this._negated = { allowed: true, as: undefined };
    return this;
  };
  allowEquated = (to: string[]): Properties<T> => {
    this._equated = { allowed: true, as: [...to] };
    return this;
  };

  allowAssignment = (
    withAssignmentFunction: (input: any) => boolean
  ): Properties<T> => {
    this._assignmentFunction = withAssignmentFunction.bind(this);
    return this;
  };
  allowCompiledTime = (value: T): Properties<T> => {
    this._compileTime = { allowed: true, as: value };
    return this;
  };

  canBeAssignedTo = (input: any): boolean => {
    if (input instanceof Properties && input.type.some(this._type.includes)) {
      return true;
    }
    return this._assignmentFunction(input);
  };
  //#endregion

  //#region Basic
  getProperties = (): IExpressionProperties<T> => {
    return {
      boolean: this._boolean,
      integer: this._integer,
      string: this._string,
      compared: this._compared,
      negated: this._negated,
      equated: this._equated,
      compileTime: this._compileTime,
      type: this._type,
    };
  };

  toString(): string {
    return `Properties <boolean: ${this._boolean}, integer: ${this._integer}, string: ${this._string}, compared: ${this._compared}, negated: ${this._negated}>`;
  }

  copy = (): Properties<T> => {
    const newProperties = new Properties<T>({ type: this.type });
    if (this._boolean.allowed) {
      newProperties.allowBoolean(this._boolean.as);
    }
    if (this._integer.allowed) {
      newProperties.allowInteger(this._integer.as);
    }
    if (this._string.allowed) {
      newProperties.allowString(this._string.as);
    }
    if (this._negated.allowed) {
      newProperties.allowNegated();
    }
    if (this._equated.allowed) {
      newProperties.allowEquated(this._equated.as);
    }
    if (this._compileTime.allowed) {
      newProperties.allowCompiledTime(this._compileTime.as);
    }

    return newProperties;
  };
  //#endregion
}

// Builder pattern may help with better understanding
export class TableElement {
  protected _name?: string;
  protected _type?: string;
  protected _line?: number = 0;
  protected _column?: IPositioning = { start: 0, end: 0 };
  protected _dataStructureType?: IDataStructureType;
  protected _scope?: string;
  protected _caster?: any;
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

  public setCaster(casterProperties: Properties<any>) {
    this._caster = casterProperties;
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

  public getCaster = () => this._caster;
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
  public readonly canBeComparedTo: string[] = [];
  public readonly canBeAssigned: string[] = [];
  public readonly defaultValue: T;
  constructor(options?: ISymbolsTableParams<T>) {
    this.scope = options?.scope ?? "global";
    this.tableName = options?.scope ?? "global";
    this.parentTable = options?.parentTable;
    this.line = options?.line ?? 0;
    this.column = options?.column || { start: 0, end: 0 };
    this.canBeInherited = options?.canBeInherited ?? true;
    this.canBeType = options?.canBeType ?? true;
    this.defaultValue = options?.defaultValue ?? ({} as T);
    this.canBeComparedTo = [
      this.tableName,
      ...(options?.canBeComparedTo ?? []),
    ];

    this.canBeAssigned = [this.tableName, ...(options?.canBeAssigned ?? [])];

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
    return this.canBeComparedTo.includes(name);
  };

  possibleTypes = (): string[] => {
    return [
      ...this.canBeComparedTo,
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
    return this.errors
      .map((error) =>
        this.printError(error.message, error.line, error.column.start)
      )
      .join("\n");
  }
}
