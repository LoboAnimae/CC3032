// import { IPositioning } from "../Misc/Errors";
// import colors from "colors";
// import {
//   IScopeOptions,
//   ITableComponent,
//   ITableElement,
// } from "../Interfaces/Table.interface";
// import { IScopeComponent, ScopeType } from "../Interfaces/Scope.interface";
// import { ITypeComponent } from "../Interfaces/Type.interface";
// interface EntryTableComponent<T> {
//   symbols: T[];
// }

// export class DependencyTreeNode
//   implements ITableComponent, ITypeComponent, IScopeComponent
// {
//   parentNode?: DependencyTreeNode;

//   elements: ITableElement[] = [];
//   name: string;
//   scopeType: ScopeType;
//   defaultValue: any;
//   canBeInherited: boolean;
//   isGeneric: boolean;
//   size: number = 0;

//   constructor(
//     options?: Partial<ITypeComponent> &
//       Partial<IScopeComponent> & { parentNode?: DependencyTreeNode }
//   ) {
//     this.defaultValue = options?.defaultValue;
//     this.name = options?.name ?? "Unknown";
//     this.scopeType = options?.scopeType ?? ScopeType.Class;
//     this.canBeInherited = options?.canBeInherited ?? true;
//     this.allowsNegation = options?.allowsNegation ?? false;
//     this._allowsAssignmentOfFunction =
//       options?.allowsAssignmentOf?.bind(this) ?? (() => false);
//     this._allowsComparisonToFunction =
//       options?.allowsComparisonsTo?.bind(this) ?? (() => false);
//     this._convertToTypeFunction =
//       options?.convertToType?.bind(this) ?? ((input: any) => input);

//     this.parentNode = options?.parentNode;
//     this.isGeneric = options?.isGeneric ?? false;
//   }

//   allowsAssignmentOf(input: ITypeComponent): boolean {
//     if (!input) return false;
//     if (
//       this?.name === input?.name ||
//       this._allowsAssignmentOfFunction?.(input) ||
//       this.parentNode?.allowsAssignmentOf?.(input)
//     ) {
//       return true;
//     }

//     return false;
//   }

//   allowsComparisonsTo(input: ITypeComponent): boolean {
//     if (!input) return false;
//     if (
//       this?.name === input?.name ||
//       this._allowsComparisonToFunction?.(input) ||
//       this.parentNode?.allowsComparisonsTo?.(input)
//     ) {
//       return true;
//     }
//     return false;
//   }
//   convertToType(input: any) {
//     if (this._convertToTypeFunction) {
//       return this._convertToTypeFunction(input);
//     }
//     return input;
//   }
//   allowsNegation: boolean;

//   private _allowsAssignmentOfFunction?: (input: any) => boolean;
//   private _allowsComparisonToFunction?: (input: any) => boolean;
//   private _convertToTypeFunction?: (input: any) => any;

//   /**
//    * Looks up a symbol in the current scope and all parent scopes.
//    * @param name The name of the symbol to look up.
//    * @returns The symbol if found, otherwise undefined.
//    */
//   get(name?: string, options?: IScopeOptions): ITableElement | undefined {
//     if (name) {
//       const foundElement = this.elements.find(
//         (symbol: ITableElement) => symbol.name === name
//       );
//       if (options?.inCurrentScopeOnly) {
//         return foundElement;
//       }
//       return foundElement ?? this.parentNode?.get(name);
//     }
//     return undefined;
//   }
//   exists(name: string, options?: IScopeOptions): boolean {
//     return !!this.get(name, options);
//   }

//   add(...elements: ITableElement[]): void {
//     let newSize =
//       elements.reduce((acc, curr) => acc + curr.size, 0) +
//       (this.elements.length ? this.size : 0);
//     this.size = newSize;
//     this.elements.push(...elements);
//   }

//   hasAsAncestor(ancestor: DependencyTreeNode): boolean {
//     return (
//       this.name === ancestor.name ||
//       this.parentNode?.hasAsAncestor(ancestor) ||
//       false
//     );
//   }

//   isAncestorOf(child?: DependencyTreeNode): boolean {
//     if (!child) return false;
//     return child?.hasAsAncestor(this) ?? false;
//   }

//   getHeritanceChain = (): DependencyTreeNode[] => {
//     return [...(this.parentNode?.getHeritanceChain() ?? []), this];
//   };

//   /**
//    * Allows for the creation of a new object exactly like this one.
//    * In a perfect world, this is never used.
//    * @returns
//    */
//   copy = () => new DependencyTreeNode({ ...this });
// }

// export interface IError {
//   message: string;
//   line: number;
//   column: number;
// }

// type AnyObject = { [key: string]: any };

// export class BasicStorage<T extends AnyObject> {
//   public readonly elements: T[];
//   constructor() {
//     this.elements = [];
//   }
//   add = (error: T) => {
//     if (this.exists(error)) return;
//     this.elements.push(error);
//   };
//   exists = (error: T): boolean => {
//     const requiredKeys = Object.keys(error);
//     return this.elements.some((existingError) => {
//       return requiredKeys.every((key) => {
//         return existingError[key] === error[key];
//       });
//     });
//   };
//   getAll = (): T[] => this.elements;
//   flush = () => {
//     this.elements.length = 0;
//   };
// }
