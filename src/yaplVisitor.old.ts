// import { yaplVisitor } from "./antlr/yaplVisitor";
// import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
// import {
//   AddContext,
//   AssignmentContext,
//   BlockContext,
//   BoolNotContext,
//   ClassDefineContext,
//   ClassesContext,
//   DivisionContext,
//   EofContext,
//   EqualContext,
//   ExpressionContext,
//   FalseContext,
//   FeatureContext,
//   FormalContext,
//   IdContext,
//   IfContext,
//   IntContext,
//   IsvoidContext,
//   LessEqualContext,
//   LessThanContext,
//   LetInContext,
//   MethodCallContext,
//   MethodContext,
//   MinusContext,
//   MultiplyContext,
//   NegativeContext,
//   NewContext,
//   OwnMethodCallContext,
//   ParenthesesContext,
//   ProgramBlocksContext,
//   ProgramContext,
//   PropertyContext,
//   StringContext,
//   TrueContext,
//   WhileContext,
// } from "./antlr/yaplParser";
// import { Stack } from "./DataStructures/Stack";
// import {
//   BasicStorage,
//   DependencyTreeNode,
//   IError,
// } from "./DataStructures/Table";
// import { PropertyContextHelper } from "./yaplCheckpoint";
// import { IScopeComponent, ScopeType } from "./Interfaces/Scope.interface";
// import {
//   IPropertyType,
//   ITableComponent,
//   ITableElement,
//   newTableElement,
// } from "./Interfaces/Table.interface";
// import { ITypeComponent } from "./Interfaces/Type.interface";
// import { TerminalNode } from "antlr4ts/tree/TerminalNode";

// enum Scope {
//   Global = 1,
//   General,
// }

// export class YaplVisitor
//   extends AbstractParseTreeVisitor<any>
//   implements yaplVisitor<any>
// {
//   public scopeStack: Stack<DependencyTreeNode>;
//   public symbolsTable: DependencyTreeNode[];
//   public mainExists: boolean = false;
//   public mainMethodExists: boolean = false;
//   public errors: BasicStorage<IError>;
//   constructor() {
//     super();
//     this.scopeStack = new Stack<DependencyTreeNode>(); // Scopes are implemented as a stack.
//     this.symbolsTable = []; // Symbols are universal
//     this.errors = new BasicStorage();

//     const IntType: DependencyTreeNode = new DependencyTreeNode({
//       name: "Int",
//       isGeneric: true,
//       scopeType: ScopeType.Class,
//       allowsNegation: true,
//       canBeInherited: false,
//       defaultValue: 0,
//       parentNode: undefined,
//       allowsAssignmentOf: function (input: any) {
//         if (input?.name === "Int") {
//           return true;
//         }
//         if (input?.name === "Bool") {
//           // TODO: Generate a warning here
//           return true;
//         }
//         return false;
//       },
//       allowsComparisonsTo: function (against: any) {
//         if (against.name === "Int") {
//           return true;
//         } else if (against.name === "Bool") {
//           // TODO: Add a warning here
//           return true;
//         }
//         return false;
//       },
//       convertToType: (input: any) => Number(input),
//     });

//     const BoolType: DependencyTreeNode = new DependencyTreeNode({
//       name: "Bool",
//       isGeneric: true,
//       defaultValue: false,
//       allowsNegation: true,
//       canBeInherited: false,
//       parentNode: undefined,
//       scopeType: ScopeType.Class,
//       allowsAssignmentOf: function (input: any) {
//         if (input?.name === "Bool") {
//           return true;
//         }
//         if (input?.name === "Int") {
//           // TODO: Generate a warning here
//           return true;
//         }
//         return false;
//       },
//       allowsComparisonsTo: function (against: any) {
//         if (against.name === "Bool") {
//           return true;
//         } else if (against.name === "Int") {
//           // TODO: Add a warning here
//           return true;
//         }
//         return false;
//       },
//       convertToType: (input: any) => Boolean(input),
//     });
//     const StringType: DependencyTreeNode = new DependencyTreeNode({
//       name: "String",
//       isGeneric: true,
//       defaultValue: "",
//       allowsNegation: false,
//       canBeInherited: false,
//       parentNode: undefined,
//       scopeType: ScopeType.Class,
//       allowsAssignmentOf: function (input: any) {
//         return input.name === "String";
//       },
//       allowsComparisonsTo: function (input: any) {
//         return false;
//       },
//       convertToType: (input: any) => String(input),
//     });

//     const lengthMethod: ITableElement = newTableElement({
//       name: "length",
//       type: IntType as ITableComponent,
//       scope: StringType,
//       propertyType: IPropertyType.Method,
//       size: 0,
//     });
//     const concatMethod: ITableElement = newTableElement({
//       name: "concat",
//       type: StringType,
//       scope: StringType,
//       propertyType: IPropertyType.Method,
//       size: 0,
//       parameters: [
//         newTableElement({
//           name: "s",
//           type: StringType,
//           propertyType: IPropertyType.Symbol,

//         }),
//       ],
//     });

//     const substrMethod: ITableElement = newTableElement({
//       name: "substr",
//       type: StringType,
//       propertyType: IPropertyType.Method,
//       parameters: [
//         newTableElement({
//           name: "i",
//           type: IntType,
//           propertyType: IPropertyType.Symbol,
//         }),
//         newTableElement({
//           name: "l",
//           type: IntType,
//           propertyType: IPropertyType.Symbol,
//         }),
//       ],
//     });

//     StringType.add(lengthMethod, concatMethod, substrMethod);

//     const IOType: DependencyTreeNode = new DependencyTreeNode({
//       name: "IO",
//       isGeneric: true,
//       defaultValue: undefined,
//       allowsAssignmentOf: () => false,
//       allowsComparisonsTo: () => false,
//       allowsNegation: false,
//       canBeInherited: false,
//       parentNode: undefined,
//       scopeType: ScopeType.Class,
//       convertToType: (input: any) => {
//         throw new Error("Cast to IO not allowed");
//       },
//     });

//     const outStringMethod: ITableElement = newTableElement({
//       name: "out_string",
//       type: IOType,
//       propertyType: IPropertyType.Method,
//       parameters: [
//         newTableElement({
//           name: "x",
//           type: StringType,
//           propertyType: IPropertyType.Symbol,
//         }),
//       ],
//     });

//     const outIntMethod: ITableElement = newTableElement({
//       name: "out_int",
//       type: IOType,
//       propertyType: IPropertyType.Method,
//       parameters: [
//         newTableElement({
//           name: "x",
//           type: IntType,
//           propertyType: IPropertyType.Symbol,
//         }),
//       ],
//     });

//     const inStringMethod: ITableElement = newTableElement({
//       name: "in_string",
//       type: StringType,
//       propertyType: IPropertyType.Method,
//     });

//     const inIntMethod: ITableElement = newTableElement({
//       name: "in_int",
//       type: IntType,
//       propertyType: IPropertyType.Method,
//     });

//     IOType.add(outStringMethod, outIntMethod, inStringMethod, inIntMethod);

//     const ObjectType: DependencyTreeNode = new DependencyTreeNode({
//       name: "Object",
//       defaultValue: "void",
//       allowsNegation: false,
//       canBeInherited: false,
//       parentNode: undefined,
//       scopeType: ScopeType.Class,
//       convertToType: (input: any) => input,
//       isGeneric: false,
//       allowsAssignmentOf: function (input: any) {
//         if (!input) {
//           return false;
//         }
//         const entireHerarchy: DependencyTreeNode[] =
//           // @ts-ignore
//           this.getHeritanceChain().map((t: DependencyTreeNode) => t.name);
//         return entireHerarchy
//           .map((t: DependencyTreeNode) => t.name)
//           .includes(input.name);
//       },
//       // @ts-ignore
//       allowsComparisonsTo: (input: any) => this.name === input.name,
//     });

//     const abortMethod: ITableElement = newTableElement({
//       name: "abort",
//       type: ObjectType,
//       propertyType: IPropertyType.Method,
//     });

//     const type_nameMethod: ITableElement = newTableElement({
//       name: "type_name",
//       type: StringType,
//       propertyType: IPropertyType.Method,
//     });

//     const copyMethod: ITableElement = newTableElement({
//       name: "copy",
//       type: ObjectType,
//       propertyType: IPropertyType.Method,
//     });

//     ObjectType.add(abortMethod, type_nameMethod, copyMethod);
//     //#endregion
//     this.scopeStack.push(ObjectType);
//     this.symbolsTable.push(IntType, BoolType, StringType, IOType, ObjectType);
//   }
//   defaultResult(): any {
//     return [];
//   }

//   protected aggregateResult(aggregate: any, nextResult: any) {
//     if (Array.isArray(nextResult)) {
//       return [...(aggregate ?? []), ...(nextResult ?? [])];
//     }
//     return [...aggregate, nextResult];
//   }

//   lineAndColumn = (ctx: any): { line: number; column: number } => ({
//     line: ctx.start?.line ?? 0,
//     column: ctx.start?.charPositionInLine ?? 0,
//   });

//   protected findType<T = ITypeComponent>(
//     name: string | ITypeComponent | TerminalNode | undefined
//   ): T | undefined {
//     if (typeof name === "string") {
//       return this.symbolsTable.find(
//         (table: DependencyTreeNode) => table.name === name
//       ) as T;
//     } else if (name instanceof DependencyTreeNode) {
//       return this.symbolsTable.find(
//         (table: DependencyTreeNode) => table.name === name.name
//       ) as T;
//     } else if (name instanceof TerminalNode) {
//       return this.symbolsTable.find(
//         (table: DependencyTreeNode) =>
//           table.name === name.text ?? name.toString()
//       ) as T;
//     }
//     return undefined;
//   }

//   protected returnToScope(scope: Scope) {
//     while (this.scopeStack.size() > scope) {
//       this.scopeStack.pop();
//     }
//   }

//   next = (ctx: any) => super.visitChildren(ctx);

//   private returnToGlobalScope() {
//     this.returnToScope(Scope.Global);
//   }

//   // The second scope in the stack is always a class
//   getCurrentScope<T = IScopeComponent>(): T {
//     return this.scopeStack.getItem(1) as T;
//   }

//   getCurrentClass<T = IScopeComponent>(): T | undefined {
//     for (let i = this.scopeStack.size() - 1; i >= 0; i--) {
//       const currentScope: IScopeComponent = this.scopeStack.getItem(i);
//       if (currentScope.scopeType === ScopeType.Class) {
//         return currentScope as T;
//       }
//     }
//     return undefined;
//   }

//   visitClassDefine = (ctx: ClassDefineContext): number => {
//     this.returnToGlobalScope();
//     const [classNode, inheritsFrom = "Object"] = ctx.TYPE();
//     const classType: ITypeComponent | undefined = this.findType(classNode);
//     const { line, column } = this.lineAndColumn(ctx);

//     // ERROR: Class inherits from itself
//     if (classNode == inheritsFrom) {
//       return this.next(ctx);
//     }

//     // ERROR: Class already exists
//     if (classType) {
//       return this.next(ctx);
//     }

//     const parentType = this.findType<ITypeComponent & IScopeComponent>(
//       inheritsFrom
//     );

//     // ERROR: Trying to inherit from a non-existing class
//     if (!parentType) {
//     }
//     // ERROR: The table can't be inherited
//     else if (!parentType.canBeInherited) {
//     }
//     // const newTable = new DependencyTreeNode({
//     //   scope: classNode.text,
//     //   parentTable: parentType,
//     //   line,
//     //   column,
//     // });

//     // if (newTable.name === "Main") {
//     //   // ERROR: Main class is declared more than once
//     //   if (this.mainExists) {
//     //     return this.next(ctx);
//     //   }
//     //   this.mainExists = this.mainExists || classNode.text === "Main";
//     //   // ERROR: Main class is trying to inherit from another class, which is not allowed
//     //   if (parentType?.name !== "Object") {
//     //   }
//     // }

//     // // Push the table to the stack and the table to the list of tables
//     // this.symbolsTable.push(newTable);
//     // this.scopeStack.push(newTable);
//     return this.next(ctx);
//   };

//   // visitMethodCall = (ctx: MethodCallContext) => {
//   //   const [methodName, ...methodParametersRaw] = ctx.expression();
//   //   const methodParameters: Table[] = methodParametersRaw.map((p) =>
//   //     this.visit(p)
//   //   );
//   //   const currentClass = this.getCurrentClass();
//   //   const currentScope = this.getCurrentScope() as ITableComponent;
//   //   const methodHoldingClass: Table | undefined =
//   //     methodName.text.toLocaleLowerCase() === "self"
//   //       ? currentClass
//   //       : this.findType(ctx.TYPE()) ??
//   //         currentScope.get(methodName.text)?.type;
//   //   const calledMethod = ctx.IDENTIFIER();

//   //   // ERROR: The method holding the class does not exist
//   //   if (!methodHoldingClass) {
//   //     return this.next(ctx);
//   //   }

//   //   const referencedMethod = methodHoldingClass.find(
//   //     calledMethod.text
//   //   ) as MethodElement;

//   //   // ERROR: The method does not exist in the class (self or not)
//   //   if (!referencedMethod) {
//   //     return this.next(ctx);
//   //   }

//   //   const requiredMethodParameters: SymbolElement[] =
//   //     referencedMethod.getParameters() ?? [];
//   //   const sameNumberOfParameters =
//   //     requiredMethodParameters.length === methodParameters.length;

//   //   // ERROR: The method is called with a different number of parameters than it requires
//   //   if (!sameNumberOfParameters) {
//   //     return this.next(ctx);
//   //   }

//   //   for (let i = 0; i < requiredMethodParameters.length; i++) {
//   //     const requiredParameterType = requiredMethodParameters[i].getType();
//   //     const methodParameterType = methodParameters[i];
//   //     const [allowed] =
//   //       requiredParameterType.allowsAssignmentOf(methodParameterType);
//   //     // ERROR: The parameter required is not the same as the one passed
//   //     if (!allowed) {
//   //       console.error();
//   //     }
//   //   }
//   //   return referencedMethod.getType();
//   // };
//   // visitOwnMethodCall = (ctx: OwnMethodCallContext) => {
//   //   const calledMethod = ctx.IDENTIFIER();
//   //   const [...methodParametersRaw] = ctx.expression();
//   //   const methodParameters: Table<any>[] = methodParametersRaw.map((p) =>
//   //     this.visit(p)
//   //   );
//   //   const methodHoldingClass = this.getCurrentScope();

//   //   const referencedMethod = methodHoldingClass.find(
//   //     calledMethod.text
//   //   ) as MethodElement;

//   //   // ERROR: The method does not exist in the class (self or not)
//   //   if (!referencedMethod) {
//   //     return this.next(ctx);
//   //   }

//   //   const requiredMethodParameters: SymbolElement[] =
//   //     referencedMethod.getParameters() ?? [];
//   //   const sameNumberOfParameters =
//   //     requiredMethodParameters.length === methodParameters.length;

//   //   // ERROR: The method is called with a different number of parameters than it requires
//   //   if (!sameNumberOfParameters) {
//   //     return this.next(ctx);
//   //   }

//   //   for (let i = 0; i < requiredMethodParameters.length; i++) {
//   //     const requiredParameterType = requiredMethodParameters[i].getType();
//   //     const methodParameterType = methodParameters[i];
//   //     const [allowed] =
//   //       requiredParameterType.allowsAssignmentOf(methodParameterType);
//   //     // ERROR: The parameter required is not the same as the one passed
//   //     if (!allowed) {
//   //       console.error();
//   //     }
//   //   }
//   //   return referencedMethod.getType();
//   // };

//   // // The first if (the one on top of the stack) defines the type, the others follow it
//   // visitIf = (ctx: IfContext) => {
//   //   // Empty bodies are disallowed by the parser in itself
//   //   const [condition, body, elses] = ctx.expression();
//   //   const conditionType = this.visit(condition);
//   //   const boolTable: Table<boolean> = this.findTable("Bool")!;

//   //   // ERROR: Condition can't be resolved to boolean
//   //   if (!boolTable.allowsAssignmentOf(conditionType)) {
//   //   }
//   //   const thisIfType = this.visit(body);
//   //   const elseBodiesType = this.visit(elses);
//   //   // ERROR: If and else bodies don't have the same type
//   //   const [allowsAssignment] = thisIfType.allowsAssignmentOf(elseBodiesType);
//   //   const isAncestor = thisIfType.isAncestorOf(elseBodiesType);
//   //   if (!allowsAssignment && !isAncestor) {
//   //   }
//   //   return thisIfType;
//   // };
//   // visitWhile = (ctx: WhileContext) => {
//   //   const expressionToCast = ctx.children?.[1];
//   //   const { line, column } = this.lineAndColumn(ctx);

//   //   // There is no expression inside the while loop
//   //   if (!expressionToCast) {
//   //     return this.next(ctx);
//   //   }
//   //   const foundExpression: Table<boolean> = this.visit(expressionToCast);
//   //   const boolTable = this.findTable("Bool")!;
//   //   const [allowsAssignment] = boolTable.allowsAssignmentOf(foundExpression);
//   //   // ERROR: The expression inside the while loop cannot be set as a boolean expression
//   //   if (!allowsAssignment) {
//   //     this.next(ctx);
//   //   }
//   //   return this.findTable("Object")!;
//   // };
//   // visitBlock = (ctx: BlockContext) => {
//   //   // Return only the last thing in the block
//   //   const resultingExpression = this.visitChildren(ctx);
//   //   if (!resultingExpression) {
//   //     return undefined;
//   //   }
//   //   const lastChild = Array.isArray(resultingExpression)
//   //     ? resultingExpression.at(-1)
//   //     : resultingExpression;
//   //   return lastChild;
//   //   // const parentContext = ctx.parent?.children?.[0];
//   //   // // Case 1: The block is inside a while loop
//   //   // if (parentContext?.text?.toLocaleLowerCase() === "while") {
//   //   // }
//   //   // // Case 2: The block is inside an if statement
//   //   // else if (parentContext?.text?.toLocaleLowerCase() === "if") {
//   //   // }
//   //   // // Case 3: The block is inside a method
//   //   // else {
//   //   //   // Expect the block to be inside a method
//   //   //   // If it is a method, return the last statement's return value
//   //   //   const lastChildRaw = this.visit(ctx.getChild(-1));
//   //   //   // ERROR: No statements inside the method. Let the method manage the error.
//   //   //   if (!lastChildRaw) {
//   //   //     return null;
//   //   //   }
//   //   //   // Allow for a table of the last value to be returned. Let the method manage the table.
//   //   //   return this.visit(lastChildRaw);
//   //   // }

//   //   // return this.next(ctx);
//   // };
//   // visitLetIn = (ctx: LetInContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitNew = (ctx: NewContext) => {
//   //   const instantiationOf = ctx.TYPE();
//   //   // Find a table with the same name as the type of the instantiation
//   //   const instantiationOfTable = this.findTable(instantiationOf);

//   //   const currentClass = this.getCurrentScope();
//   //   const { line, column } = this.lineAndColumn(ctx);

//   //   // ERROR: Trying to instantiate a non-existing class
//   //   if (!instantiationOfTable) {
//   //     return undefined;
//   //   }
//   //   // ERROR: Trying to instantiate the class we're currently in
//   //   else if (instantiationOfTable.tableName === currentClass.tableName) {
//   //     return undefined;
//   //   }

//   //   return instantiationOfTable;
//   // };
//   // visitNegative = (ctx: NegativeContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitIsvoid = (ctx: IsvoidContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitMultiply = (ctx: MultiplyContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitDivision = (ctx: DivisionContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitAdd = (ctx: AddContext) => {
//   //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
//   //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

//   //   const intTable: Table<number> = this.findTable("Int")!.copy();

//   //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
//   //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

//   //   // ERROR: One of the expressions cannot be set as an integer
//   //   if (!lCanBeInt || !rCanBeInt) {
//   //     return undefined;
//   //   }
//   //   return intTable.setValue(lExpr.value + rExpr.value);
//   // };
//   // visitMinus = (ctx: MinusContext) => {
//   //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
//   //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

//   //   const intTable: Table<number> = this.findTable("Int")!.copy();

//   //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
//   //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

//   //   // ERROR: One of the expressions cannot be set as an integer
//   //   if (!lCanBeInt || !rCanBeInt) {
//   //     return undefined;
//   //   }
//   //   return intTable.setValue(lExpr.value - rExpr.value);
//   // };

//   // // Less thans return booleans.
//   // visitLessThan = (ctx: LessThanContext) => {
//   //   // TODO:
//   //   const lExpr: Table<number> = this.visit(ctx.children?.[0]!);
//   //   const rExpr: Table<number> = this.visit(ctx.children?.[2]!);
//   //   const { line, column } = this.lineAndColumn(ctx);

//   //   const intTable = this.findTable("Int")!.copy();

//   //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
//   //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

//   //   // ERROR: One of the expressions cannot be set as an integer
//   //   if (!lCanBeInt || !rCanBeInt) {
//   //     return undefined;
//   //   }
//   //   return this.findTable("Bool")!
//   //     .copy()
//   //     .setValue(lExpr.value < rExpr.value);
//   // };
//   // visitLessEqual = (ctx: LessEqualContext) => {
//   //   // Must be done between two possible integers
//   //   const lExpr: Table<number> = this.visit(ctx.children?.[0]!);
//   //   const rExpr: Table<number> = this.visit(ctx.children?.[2]!);
//   //   const { line, column } = this.lineAndColumn(ctx);

//   //   const intTable = this.findTable("Int")!.copy();

//   //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
//   //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

//   //   // ERROR: One of the expressions cannot be set as an integer
//   //   if (!lCanBeInt || !rCanBeInt) {
//   //     return undefined;
//   //   }
//   //   return this.findTable("Bool")!
//   //     .copy()
//   //     .setValue(lExpr.value <= rExpr.value);
//   // };
//   // visitEqual = (ctx: EqualContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitBoolNot = (ctx: BoolNotContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitParentheses = (ctx: ParenthesesContext) => {
//   //   return this.visit(ctx.expression());
//   // };
//   // visitId = (ctx: IdContext) => {
//   //   // Find it in the scope
//   //   const [name] = ctx.children!;
//   //   if (name.text.toLocaleLowerCase() === "self") {
//   //     return this.getCurrentScope();
//   //   }
//   //   const currentScope = this.getCurrentScope()!;
//   //   const foundSymbol = currentScope.find(name.text);
//   //   const line = ctx.start?.line ?? 0;
//   //   const column = {
//   //     start: ctx.start?.charPositionInLine ?? 0,
//   //     end: ctx.stop?.charPositionInLine ?? 0,
//   //   };
//   //   // The ID is being used, but it wasn't defined yet
//   //   if (!foundSymbol) {
//   //     return undefined;
//   //   }
//   //   return this.findTable(foundSymbol?.getType()!);
//   // };
//   // visitInt = (ctx: IntContext): Table<number> => {
//   //   return this.findTable("Int")!.copy().setValue(parseInt(ctx.INT().text));
//   // };

//   // visitString = (ctx: StringContext): Table<string> => {
//   //   return this.findTable("String")!.copy().setValue(ctx.STRING().text);
//   // };
//   // visitTrue = (_ctx: TrueContext): Table<boolean> => {
//   //   return this.findTable("Bool")!.copy().setValue(true);
//   // };
//   // visitFalse = (_ctx: FalseContext): Table<boolean> => {
//   //   return this.findTable("Bool")!.copy().setValue(false);
//   // };
//   // visitAssignment = (ctx: AssignmentContext) => {
//   //   const assignmentTo = ctx.IDENTIFIER();
//   //   const assignmentValue: Table<any> = this.visit(ctx.expression());
//   //   const currentScope = this.getCurrentScope()!;
//   //   const foundSymbolType: Table<any> | undefined = currentScope
//   //     .find(assignmentTo.text)
//   //     ?.getType();

//   //   // ERROR: The variable does not exist yet
//   //   if (!foundSymbolType) {
//   //     return undefined;
//   //   }

//   //   const [canBeAssigned] = foundSymbolType.allowsAssignmentOf(assignmentValue);

//   //   const isAncestor = foundSymbolType.isAncestorOf(assignmentValue);

//   //   // ERROR: Value is not assignable to the variable
//   //   if (!canBeAssigned && !isAncestor) {
//   //     return undefined;
//   //   }

//   //   return foundSymbolType;
//   // };
//   // visitMethod = (ctx: MethodContext) => {
//   //   const methodFoundType = ctx.TYPE();
//   //   if (!methodFoundType) {
//   //     return this.next(ctx);
//   //   }
//   //   const formalParameters = ctx.formal();
//   //   const allParameters: SymbolElement[] = formalParameters.map((param) =>
//   //     this.visit(param)
//   //   );

//   //   const methodType =
//   //     methodFoundType.text === "SELF_TYPE"
//   //       ? this.getCurrentScope()
//   //       : this.findTable(methodFoundType);
//   //   const methodTable = new Table({
//   //     canBeType: false,
//   //     allowNegation: false,
//   //     assigmentFunction: () =>
//   //       function (an?: any) {
//   //         return [false, undefined];
//   //       },
//   //     canBeAssigned: [],
//   //     canBeComparedTo: [],
//   //     canBeInherited: false,
//   //     column: { start: 0, end: 0 },
//   //     line: 0,
//   //     comparisonFunction: () =>
//   //       function (an?: any) {
//   //         return [false, undefined];
//   //       },
//   //     defaultValue: undefined,
//   //     errors: undefined,
//   //     isGeneric: false,
//   //     parentTable: methodType,
//   //     scope: "",
//   //     typeCohersionFunction: () =>
//   //       function (an?: any) {
//   //         return [false, undefined];
//   //       },
//   //     warnings: undefined,
//   //   });
//   //   this.scopeStack.push(methodTable);
//   //   // ERROR: The method type is not yet defined (if ever)
//   //   if (!methodType) {
//   //     return this.next(ctx);
//   //   }

//   //   const expressionRaw = ctx.expression()!; // If it doesn't exist, it is a syntax error
//   //   const expressionType: Table<any> | undefined = this.visit(expressionRaw);
//   //   // ERROR: If the expression is not valid, it will be null
//   //   if (!expressionType) {
//   //   }

//   //   const [canBeAssigned] = methodType.allowsAssignmentOf(expressionType);
//   //   const isAncestor = methodType.isAncestorOf(expressionType);

//   //   // ERROR: Last child and return type do not match or can't be assigned
//   //   if (!canBeAssigned && !isAncestor) {
//   //   }

//   //   const currentTable = this.getCurrentScope()!;
//   //   const { line, column } = this.lineAndColumn(ctx);
//   //   const newMethod = new Table({
//   //     column: column,
//   //     line: line,
//   //     scope: ctx.IDENTIFIER().text,
//   //     canBeType: false,
//   //     allowNegation: false,
//   //     assigmentFunction: () => () => [false, undefined],
//   //     canBeAssigned: [],
//   //     canBeComparedTo: [],
//   //     canBeInherited: false,
//   //     comparisonFunction: () => () => [false, undefined],
//   //     defaultValue: undefined,
//   //     errors: undefined,
//   //     isGeneric: false,
//   //     parentTable: methodType,
//   //     typeCohersionFunction: () => () => [false, undefined],
//   //     warnings: undefined,
//   //   });
//   //   for (const param of allParameters) {
//   //     newMethod.addElement(param);
//   //   }

//   //   currentTable.addElement(newMethod);
//   //   this.scopeStack.pop();

//   //   return methodType;
//   // };
//   // visitProperty = (ctx: PropertyContext) => {
//   //   // Previous table
//   //   const name = ctx.IDENTIFIER();
//   //   const dataType = ctx.TYPE();
//   //   const assignmentExpression = ctx.expression();

//   //   const previousClass: Table<any> | undefined = this.findTable(dataType);
//   //   const previousClassCopy = previousClass?.copy(); // Create a copy that can go out of scope
//   //   const line = ctx.start?.line ?? 0;
//   //   const column = {
//   //     start: ctx.start?.charPositionInLine ?? 0,
//   //     end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
//   //   };

//   //   // ERROR: The type is not yet defined
//   //   if (!previousClass) {
//   //     return this.next(ctx);
//   //   }

//   //   if (assignmentExpression) {
//   //     const resolvesTo: Table<any> = this.visit(assignmentExpression);

//   //     const [allowedAssigmentTo] = previousClass.allowsAssignmentOf(resolvesTo);
//   //     // ERROR: Not allowed an assignment and the assignment is not to an ancestor
//   //     if (!allowedAssigmentTo && !previousClass?.isAncestorOf(resolvesTo)) {
//   //       console.error();
//   //     }
//   //     previousClassCopy!.setValue(resolvesTo?.value);
//   //   }
//   //   const currentScopeTable = this.getCurrentScope();

//   //   // const previousDeclared = currentScopeTable?.find(variableName);
//   //   const newTableElement = new SymbolElement()
//   //     .setColumn(column)
//   //     .setLine(line)
//   //     .setName(name.text)
//   //     .setType(previousClass)
//   //     .setScope(currentScopeTable?.tableName ?? "Global")
//   //     .setValue(
//   //       previousClassCopy?.value ??
//   //         previousClass.convertToType(assignmentExpression?.text) ??
//   //         previousClass.defaultValue ??
//   //         undefined
//   //     );

//   //   const previousDeclared = currentScopeTable.find(name.text);
//   //   // Case 1: Overriding (It does nothing)
//   //   if (previousDeclared) {
//   //     // ERROR: This name was previously defined
//   //     if (previousDeclared.getScope() === newTableElement.getScope()) {
//   //       // ERROR: Redefinition of a variable in the same scope
//   //       if (
//   //         previousDeclared.getDataStructureType() ===
//   //         newTableElement.getDataStructureType()
//   //       ) {
//   //       }
//   //       // ERROR: Definition of a variable with the name of a method, or viseversa
//   //       else {
//   //       }
//   //     }

//   //     // ERROR: The variable was defined in a parent scope, but the definition type is not the same
//   //     else if (previousDeclared.getType() !== newTableElement.getType()) {
//   //     }
//   //     return this.next(ctx);
//   //   }

//   //   // Case 2: Declaration of a new property
//   //   currentScopeTable.addElement(newTableElement);
//   //   return this.next(ctx);
//   // };
//   // visitClasses = (ctx: ClassesContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitEof = (ctx: EofContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitProgram = (ctx: ProgramContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitProgramBlocks = (ctx: ProgramBlocksContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitFeature = (ctx: FeatureContext) => {
//   //   return this.next(ctx);
//   // };
//   // visitFormal = (ctx: FormalContext) => {
//   //   const name = ctx.IDENTIFIER();
//   //   const datatype = ctx.TYPE();
//   //   const foundTable = this.findTable(datatype);

//   //   // ERROR: The type is not yet defined
//   //   if (!foundTable) {
//   //     return undefined;
//   //   }

//   //   const { line, column } = this.lineAndColumn(ctx);
//   //   const newSymbol = new SymbolElement()
//   //     .setColumn(column)
//   //     .setLine(line)
//   //     .setName(name.text)
//   //     .setType(foundTable);
//   //   return newSymbol;
//   // };
//   // visitExpression = (ctx: ExpressionContext) => {
//   //   return this.next(ctx);
//   // };
// }
