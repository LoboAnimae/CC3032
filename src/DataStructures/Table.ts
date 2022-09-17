import { IPositioning } from "../Misc/Errors";
import colors from "colors";

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

interface ITableElementProperties {
  name: string;
  type: Table<any>;
  line: number;
  column: IPositioning;
  dataStructureType: IDataStructureType;
  scope: string;
  size: number;
}

interface ITableElementOptions extends Partial<ITableElementProperties> {}

// Builder pattern may help with better understanding
export class TableElement implements ITableElementProperties {
  name: string;
  type: Table<any>;
  line: number = 0;
  column: IPositioning = { start: 0, end: 0 };
  dataStructureType: IDataStructureType;
  scope: string;
  size: number;

  constructor(options?: ITableElementOptions) {
    this.name = options?.name ?? "";
    this.type = options?.type!;
    this.line = options?.line ?? 0;
    this.column = options?.column ?? { start: -1, end: -1 };
    this.dataStructureType =
      options?.dataStructureType ?? IDataStructureType.Method;
    this.scope = options?.scope ?? "";
    this.size = options?.size ?? 0;
  }

  public _givenValue?: any;
  get givenValue() {
    return this._givenValue;
  }
  set givenValue(newDefaultValue: any) {
    this._givenValue = newDefaultValue;
  }

  public setValue(value: any) {
    this._givenValue = value;
    return this;
  }

  public setScope(scope: string) {
    this.scope = scope;
    return this;
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setType(type: Table<any>) {
    this.type = type;
    this.size = type.size;
    return this;
  }

  public setLine(line: number) {
    this.line = line;
    return this;
  }

  public setColumn(column: IPositioning) {
    this.column = column;
    return this;
  }

  public setStartColumn(start: number) {
    this.column!.start = start;
    return this;
  }

  public setEndColumn(end: number) {
    this.column!.end = end;
    return this;
  }

  public setDataStructureType(dataStructureType: IDataStructureType) {
    this.dataStructureType = dataStructureType;
    return this;
  }

  public setSize(newSize: number) {
    this.size = newSize;
    return this;
  }

  public getScope = () => this.scope;

  public getName = () => this.name;

  public getType = () => this.type;

  public getLine = () => this.line;

  public getColumn = () => this.column;

  public getStartColumn = () => this.column?.start;

  public getEndColumn = () => this.column?.end;

  public getDataStructureType = () => this.dataStructureType;
  public getSize = () => this.size;

  public isSameName = (name: string) => this.name === name;
  public toString(): string {
    return `[${this.dataStructureType ?? "Unknown Data Type"}] ${
      this.name ?? "Unknown Name"
    } (${this.type ?? "Unknown Type"})`;
  }

  public copy(): TableElement {
    return new TableElement()
      .setName(this.name!)
      .setType(this.type!)
      .setLine(this.line!)
      .setColumn(this.column!)
      .setDataStructureType(this.dataStructureType!)
      .setScope(this.scope!);
  }
}
export class SymbolElement extends TableElement {
  constructor(options?: ITableElementOptions) {
    super(options);
    this.dataStructureType = IDataStructureType.Symbol;
  }
}

export class MethodElement extends TableElement {
  public symbols: SymbolElement[] = [];
  public parentTable?: Table<any>;
  constructor(options?: ITableElementOptions & { parentTable: Table<any> }) {
    super(options);
    this.dataStructureType = IDataStructureType.Method;
    this.parentTable = options?.parentTable;
  }

  public addParameter(...parameter: SymbolElement[]) {
    this.symbols.push(...parameter);
    return this;
  }
  public getParameters() {
    return this.symbols;
  }

  public setParentTable(table: Table<any>) {
    this.parentTable = table;
    return this;
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

  public setReturnType(type: Table<any>) {
    return this.setType(type);
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
  defaultValue?: T;
  canBeAssigned?: string[];
  allowNegation?: boolean;
  assigmentFunction?: () => (input: Table<any>) => [boolean, string?];
  comparisonFunction?: () => (input: Table<any>) => [boolean, string?];
  typeCohersionFunction?: () => (input: any) => any;
  errors?: ErrorsTable;
  warnings?: ErrorsTable;
}

interface ISymbolsTableCloneParams<T> {
  scope: string;
  parentTable?: Table<any>;
  line: number;
  column: IPositioning;
  canBeType: boolean;
  canBeInherited: boolean;
  isGeneric: boolean;
  canBeComparedTo: string[];
  defaultValue?: T;
  canBeAssigned: string[];
  allowNegation: boolean;
  assigmentFunction: () => (input: Table<any>) => [boolean, string?];
  comparisonFunction: () => (input: Table<any>) => [boolean, string?];
  typeCohersionFunction: () => (input: any) => any;
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
  public readonly allowsComparisonsTo: (
    input: Table<any>
  ) => [boolean, string?];
  public readonly canBeAssigned: string[] = [];
  public readonly defaultValue?: T;
  public readonly convertToType: (input: any) => any;
  public readonly allowsAssignmentOfFunction: (
    input: Table<any>
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
    this.defaultValue = options?.defaultValue;
    this._canBeComparedTo = [
      this.tableName,
      ...(options?.canBeComparedTo ?? []),
    ];

    this.canBeAssigned = [this.tableName, ...(options?.canBeAssigned ?? [])];
    this.allowsAssignmentOfFunction =
      options?.assigmentFunction?.().bind(this) ?? (() => [false]);
    this.allowsComparisonsTo =
      options?.comparisonFunction?.().bind(this) ??
      (() => {
        throw new Error(`Comparison not implemented in ${this.tableName}`);
      });

    this.warnings = options?.warnings;
    this.errors = options?.errors;
    this.convertToType =
      options?.typeCohersionFunction?.().bind(this) ?? ((inp: any) => inp);

    this.allowNegation = options?.allowNegation ?? false;
    if (options?.isGeneric) {
      this.canBeInherited = false;
      this.canBeType = true;
      this.isGeneric = true;
    }
  }

  hasAsAncestor(ancestor: Table<any>): boolean {
    return (
      this.tableName === ancestor.tableName ||
      this.parentTable?.hasAsAncestor(ancestor) ||
      false
    );
  }

  isAncestorOf(child?: Table<any>): boolean {
    if (!child) return false;
    return child?.hasAsAncestor(this) ?? false;
  }
  allowsAssignmentOf(input?: Table<any>): [boolean, string?] {
    if (!input) return [false];
    if (this?.tableName === input?.tableName) {
      return [true];
    }
    const allowedHere = this.allowsAssignmentOfFunction?.(input);
    if (allowedHere && allowedHere[0]) {
      return allowedHere;
    }

    // const allowedInParent = this.parentTable?.allowsAssignmentOf(input);
    // if (allowedInParent && allowedInParent[0]) {
    //   return allowedInParent;
    // }
    return allowedHere;
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

  getHeritanceChain = (): Table<any>[] => {
    return [...(this.parentTable?.getHeritanceChain() ?? []), this];
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
  public sizeTable = () => {
    return { "Table Name": this.tableName, "Size in Bytes": this.size };
  };

  public toString = (): string => {
    if (this.isGeneric || this.tableName === "Object") return "";
    return this.scope;
  };

  public getAllProperties = (): { [key: string]: any } => {
    return {
      "Table Name": this.tableName,
      "Size in Bytes": this.size,
      Scope: this.scope,
      "Inherits From": this.parentTable?.tableName ?? "None",
      Line: this.line,
      Column: this.column.start,
      "Can Be Inherited": this.canBeInherited,
      "Can Be Type": this.canBeType,
      "Can Be Compared To": this._canBeComparedTo.join(", "),
      "Can Be Assigned": this.canBeAssigned.join(", "),
      "Can Be Negated": this.allowNegation,
      "Is Generic": this.isGeneric,
    };
  };

  private _value?: any;
  get value() {
    return this._value ?? this.defaultValue;
  }

  set value(newValue: any) {
    this._value = newValue;
  }

  setValue = (value: any) => {
    this.value = value;
    return this;
  };

  copy() {
    const creationObj: ISymbolsTableCloneParams<T> = {
      defaultValue: this.defaultValue,
      parentTable: this.parentTable,
      scope: this.scope,
      line: this.line,
      column: this.column,
      canBeInherited: this.canBeInherited,
      canBeType: this.canBeType,
      isGeneric: this.isGeneric,
      allowNegation: this.allowNegation,
      canBeAssigned: this.canBeAssigned,
      warnings: this.warnings,
      errors: this.errors,
      canBeComparedTo: this._canBeComparedTo.slice(1),
      comparisonFunction: () => this.allowsComparisonsTo,
      typeCohersionFunction: () => this.convertToType,
      assigmentFunction: () => this.allowsAssignmentOfFunction,
    };
    return new Table<T>(creationObj);
  }
}
export interface IErrorOptions {
  message: string;
  line: number;
  column: { start: number; end: number };
}

export class IError {
  _message: string;
  _line: number;
  _column: IPositioning;
  constructor(options?: IErrorOptions) {
    this._message = options?.message ?? "";
    this._line = options?.line ?? -1;
    this._column = options?.column ?? { start: -1, end: -1 };
  }

  get message() {
    return this._message;
  }
  set message(message: string) {
    this._message = message;
  }

  get line() {
    return this._line;
  }
  set line(line: number) {
    this._line = line;
  }

  get column() {
    return this._column;
  }
  set column(column: IPositioning) {
    this._column = column;
  }

  public toString = (): string => {
    return ErrorsTable.quotedErrorFormat(
      "Error: {} at line {} column {}",
      this.message,
      this.line,
      this.column.start
    );
  };

  public getAllProperties = (): { [key: string]: any } => {
    return {
      Message: this.message,
      Line: this.line,
      Column: this.column.start,
    };
  };
}

export class ErrorsTable {
  unwrap() {
    return this.errors.map((error: IError) => ({
      line: error.line,
      column: error.column,
      message: error.message,
    }));
  }
  public readonly errors: IError[];
  constructor() {
    this.errors = [];
  }
  static errorFormat = (errorMessage: string, ...args: any[]) => {
    let currentString = errorMessage;

    args.forEach((arg) => {
      currentString = currentString.replace(`{}`, `${arg}`.yellow);
    });
    return currentString;
  };

  static quotedErrorFormat = (errorMessage: string, ...args: any[]) => {
    const quotedArgs = args.map((arg) => `"${arg}"`);
    return ErrorsTable.errorFormat(errorMessage, ...quotedArgs);
  };

  addError = (error: IError | IErrorOptions) => {
    if (this.errorExists(error)) return;
    if (error instanceof IError) {
      this.errors.push(error);
    } else {
      this.errors.push(new IError(error));
    }
  };

  errorExists = (error: IError | IErrorOptions) => {
    return !!this.errors.find(
      (err) =>
        err.message === error.message &&
        err.line === error.line &&
        err.column.start === error.column.start &&
        err.column.end === error.column.end
    );
  };
  getErrors = (): IError[] => this.errors;
  toTable = () => {
    return this.errors.map((error) => error.getAllProperties());
  };
}
