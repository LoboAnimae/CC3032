import { yaplVisitor } from "./antlr/yaplVisitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import {
  AddContext,
  AssignmentContext,
  BlockContext,
  BoolNotContext,
  ClassDefineContext,
  ClassesContext,
  DivisionContext,
  EofContext,
  EqualContext,
  ExpressionContext,
  FalseContext,
  FeatureContext,
  FormalContext,
  IdContext,
  IfContext,
  IntContext,
  IsvoidContext,
  LessEqualContext,
  LessThanContext,
  LetInContext,
  MethodCallContext,
  MethodContext,
  MinusContext,
  MultiplyContext,
  NegativeContext,
  NewContext,
  OwnMethodCallContext,
  ParenthesesContext,
  ProgramBlocksContext,
  ProgramContext,
  PropertyContext,
  StringContext,
  TrueContext,
  WhileContext,
} from "./antlr/yaplParser";
import { Stack } from "./DataStructures/Stack";
import {
  ErrorsTable,
  MethodElement,
  Table,
  TableElement,
} from "./DataStructures/Table";
import { PropertyContextHelper } from "./yaplCheckpoint";
import { SymbolElement } from "./Implementations/SymbolsTable";
import { IntegerType } from "./Implementations/Generics";

enum Scope {
  Global = 1,
  General,
}

export class YaplVisitor
  extends AbstractParseTreeVisitor<any>
  implements yaplVisitor<any>
{
  public scopeStack: Stack<Table<any> | MethodElement>;
  public symbolsTable: Table<any>[];
  public mainExists: boolean = false;
  public mainMethodExists: boolean = false;
  public errors: ErrorsTable;
  constructor() {
    super();
    this.scopeStack = new Stack<Table<any>>(); // Scopes are implemented as a stack.
    this.symbolsTable = []; // Symbols are universal
    this.errors = new ErrorsTable();

    const integer = new IntegerType();
    console.log(integer);

    // const IntType = new Table<number>({
    //   errors: this.errors,
    //   scope: "Int",
    //   isGeneric: true,
    //   canBeComparedTo: ["Bool"],
    //   defaultValue: 0,
    //   allowNegation: true,
    //   assigmentFunction: () =>
    //     function (input: Table<any>) {
    //       if (input?.tableName === "Int") {
    //         return [true];
    //       }
    //       if (input?.tableName === "Bool") {
    //         // TODO: Generate a warning here
    //         return [true];
    //       }
    //       return [false];
    //     },
    //   comparisonFunction: () =>
    //     function (against: Table<any>) {
    //       if (against.tableName === "Int") {
    //         return [true];
    //       } else if (against.tableName === "Bool") {
    //         // TODO: Add a warning here
    //         return [true];
    //       }
    //       return [false];
    //     },
    //   typeCohersionFunction: () => (input: any) => Number(input),
    // });

    // const BoolType = new Table<boolean>({
    //   errors: this.errors,
    //   scope: "Bool",
    //   isGeneric: true,
    //   canBeComparedTo: ["Int"],
    //   defaultValue: false,
    //   allowNegation: true,
    //   assigmentFunction: () =>
    //     function (input: Table<any>) {
    //       if (input?.tableName === "Bool") {
    //         return [true];
    //       }
    //       if (input?.tableName === "Int") {
    //         // TODO: Generate a warning here
    //         return [true];
    //       }
    //       return [false];
    //     },
    //   comparisonFunction: () =>
    //     function (against: Table<any>) {
    //       if (against.tableName === "Bool") {
    //         return [true];
    //       } else if (against.tableName === "Int") {
    //         // TODO: Add a warning here
    //         return [true];
    //       }
    //       return [false];
    //     },
    //   typeCohersionFunction: () => (input: any) => Boolean(input),
    // });
    // const StringType = new Table<string>({
    //   scope: "String",
    //   isGeneric: true,
    //   defaultValue: "",
    //   assigmentFunction: () =>
    //     function (input: Table<any>) {
    //       return [input.tableName === "String"];
    //     },
    //   comparisonFunction: () => () => [false],
    // });
    // const lengthMethod = new MethodElement()
    //   .setName("length")
    //   .setReturnType(IntType);

    // const concatMethod = new MethodElement()
    //   .setName("concat")
    //   .setReturnType(StringType)
    //   .addParameter(new SymbolElement({ name: "s", type: StringType }));

    // const substrMethod = new MethodElement()
    //   .setName("substr")
    //   .setReturnType(StringType)
    //   .addParameter(new SymbolElement({ name: "i", type: IntType }))
    //   .addParameter(new SymbolElement({ name: "l", type: IntType }));

    // StringType.symbols.push(lengthMethod, concatMethod, substrMethod);
    // const IOType = new Table<undefined>({
    //   scope: "IO",
    //   isGeneric: true,
    //   defaultValue: undefined,
    // });

    // const outStringMethod = new MethodElement()
    //   .setName("out_string")
    //   .setReturnType(IOType)
    //   .addParameter(new SymbolElement({ name: "x", type: StringType }));

    // const outIntMethod = new MethodElement()
    //   .setName("out_int")
    //   .setReturnType(IOType)
    //   .addParameter(new SymbolElement({ name: "x", type: IntType }));

    // const inStringMethod = new MethodElement()
    //   .setName("in_string")
    //   .setReturnType(StringType);

    // const inIntMethod = new MethodElement()
    //   .setName("in_int")
    //   .setReturnType(IntType);

    // IOType.addElement(
    //   outStringMethod,
    //   outIntMethod,
    //   inStringMethod,
    //   inIntMethod
    // );
    // const ObjectType = new Table<{}>({
    //   scope: "Object",
    //   defaultValue: "void",
    //   assigmentFunction: () =>
    //     function (input: Table<any>) {
    //       if (!input) {
    //         return [false];
    //       }
    //       // @ts-ignore
    //       const entireHerarchy: Table<any>[] = this.getHeritanceChain().map(
    //         (t: Table<any>) => t.tableName
    //       );
    //       return [
    //         entireHerarchy
    //           .map((t: Table<any>) => t.tableName)
    //           .includes(input.tableName),
    //       ];
    //     },
    //   comparisonFunction: () =>
    //     function () {
    //       return [false];
    //     },
    // });

    // const abortMethod = new MethodElement()
    //   .setReturnType(ObjectType)
    //   .setName("abort");

    // const typeNameMethod = new MethodElement()
    //   .setReturnType(StringType)
    //   .setName("type_name");

    // const copyMethod = new MethodElement()
    //   .setReturnType(ObjectType)
    //   .setName("copy");

    // ObjectType.addElement(abortMethod, typeNameMethod, copyMethod);
    // //#endregion
    // this.scopeStack.push(ObjectType);
    // this.symbolsTable.push(IntType, BoolType, StringType, IOType, ObjectType);
  }
  defaultResult(): any {
    return [];
  }

  protected aggregateResult(aggregate: any, nextResult: any) {
    if (Array.isArray(nextResult)) {
      return [...(aggregate ?? []), ...(nextResult ?? [])];
    }
    return [...aggregate, nextResult];
  }

  // lineAndColumn = (ctx: any) => ({
  //   line: ctx.start?.line ?? 0,
  //   column: {
  //     start: ctx.start?.charPositionInLine ?? 0,
  //     end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
  //   },
  // });

  // addError(ctx: any, errorMessage: string) {
  //   const { line, column } = this.lineAndColumn(ctx);
  //   this.errors.addError({ line, column, message: errorMessage });
  // }

  // protected findTable(name: string | Table<any> | any): Table<any> | undefined {
  //   if (typeof name === "string") {
  //     return this.symbolsTable.find(
  //       (table: Table<any>) => table.scope === name
  //     );
  //   } else if (name instanceof Table) {
  //     return this.symbolsTable.find(
  //       (table: Table<any>) => table.scope === name.scope
  //     );
  //   } else if (name) {
  //     return this.symbolsTable.find(
  //       (table: Table<any>) => table.scope === name.text ?? name.toString()
  //     );
  //   }
  //   return undefined;
  // }

  // protected returnToScope(scope: Scope) {
  //   while (this.scopeStack.size() > scope) {
  //     this.scopeStack.pop();
  //   }
  // }

  // next = (ctx: any) => super.visitChildren(ctx);

  // private returnToGlobalScope() {
  //   this.returnToScope(Scope.Global);
  // }

  // // The second scope in the stack is always a class
  // private getCurrentScope<T = Table<any>>(): T {
  //   return this.scopeStack.getItem(1) as T;
  // }
  // visitClassDefine = (ctx: ClassDefineContext): number => {
  //   this.returnToGlobalScope();
  //   const [cls, inheritsFrom = "Object"] = ctx.TYPE();
  //   const classTable = this.findTable(cls);
  //   const { line, column } = this.lineAndColumn(ctx);
  //   // ERROR: Class inherits from itself
  //   if (cls == inheritsFrom) {
  //     return this.next(ctx);
  //   }

  //   // ERROR: Class already exists
  //   if (classTable) {
  //     this.addError(ctx, `Redefinition of class ${cls}`);
  //     return this.next(ctx);
  //   }

  //   const parentTable = this.findTable(inheritsFrom);

  //   // ERROR: Trying to inherit from a non-existing class
  //   if (!parentTable) {
  //     this.addError(
  //       ctx,
  //       `Class ${cls} is trying to inherit from class ${inheritsFrom}, which does not exist`
  //     );
  //   }
  //   // ERROR: The table can't be inherited
  //   else if (!parentTable.canBeInherited) {
  //     this.addError(ctx, `Class ${inheritsFrom} can't be inherited`);
  //   }
  //   const newTable = new Table({
  //     scope: cls.text,
  //     parentTable,
  //     line,
  //     column,
  //   });

  //   if (newTable.tableName === "Main") {
  //     // ERROR: Main class is declared more than once
  //     if (this.mainExists) {
  //       this.addError(ctx, "Main class is declared more than once");
  //       return this.next(ctx);
  //     }
  //     this.mainExists = this.mainExists || cls.text === "Main";
  //     // ERROR: Main class is trying to inherit from another class, which is not allowed
  //     if (parentTable?.tableName !== "Object") {
  //       this.addError(
  //         ctx,
  //         `Main class can't inherit from ${inheritsFrom} (Main class can only inherit from Object)`
  //       );
  //     }
  //   }

  //   // Push the table to the stack and the table to the list of tables
  //   this.symbolsTable.push(newTable);
  //   this.scopeStack.push(newTable);
  //   return this.next(ctx);
  // };

  // visitMethodCall = (ctx: MethodCallContext) => {
  //   const [variableName, ...methodParametersRaw] = ctx.expression();
  //   const methodParameters: Table<any>[] = methodParametersRaw.map((p) =>
  //     this.visit(p)
  //   );
  //   const variable = this.visit(variableName);

  //   // ERROR: Variable is not defined
  //   if (!variable) {
  //     return this.next(ctx);
  //   }

  //   const methodHoldingClass: Table<any> | undefined =
  //     variableName.text.toLocaleLowerCase() === "self"
  //       ? this.getCurrentScope()
  //       : this.findTable(ctx.TYPE()) ??
  //         this.getCurrentScope().find(variableName.text)?.getType();

  //   // ERROR: The method holding the class does not exist
  //   if (!methodHoldingClass) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call method from non-existing class (class ${ctx.TYPE()} does not exist or is not yet defined)`
  //     );
  //     return this.next(ctx);
  //   }
  //   const isAncestor = methodHoldingClass.isAncestorOf(variable);

  //   // ERROR: A class is able to call only its own methods or it's parents methods
  //   if (!isAncestor) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call method from class ${methodHoldingClass.tableName} from class ${variable.tableName}, but ${variable.tableName} is not a child of ${methodHoldingClass.tableName}`
  //     );
  //   }

  //   const calledMethod = ctx.IDENTIFIER();
  //   const referencedMethod = methodHoldingClass.find(
  //     calledMethod.text
  //   ) as MethodElement;

  //   // ERROR: The method does not exist in the class (self or not)
  //   if (!referencedMethod) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call non-existing method ${calledMethod.text} from class ${methodHoldingClass.tableName}`
  //     );
  //     return this.next(ctx);
  //   }

  //   const requiredMethodParameters: SymbolElement[] =
  //     referencedMethod.getParameters() ?? [];
  //   const sameNumberOfParameters =
  //     requiredMethodParameters.length === methodParameters.length;

  //   // ERROR: The method is called with a different number of parameters than it requires
  //   if (!sameNumberOfParameters) {
  //     this.addError(
  //       ctx,
  //       `Incorrect number of parameters for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredMethodParameters.length}, got ${methodParameters.length})`
  //     );
  //     return this.next(ctx);
  //   }

  //   for (let i = 0; i < requiredMethodParameters.length; i++) {
  //     const requiredParameterType = requiredMethodParameters[i].getType();
  //     const methodParameterType = methodParameters[i];
  //     const [allowed] =
  //       requiredParameterType.allowsAssignmentOf(methodParameterType);
  //     // ERROR: The parameter required is not the same as the one passed
  //     if (!allowed) {
  //       this.addError(
  //         ctx,
  //         `Incorrect type of parameter ${requiredMethodParameters[i].name} for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredParameterType.tableName}, got ${methodParameterType.tableName})`
  //       );
  //     }
  //   }
  //   return referencedMethod.getType();
  // };

  // visitOwnMethodCall = (ctx: OwnMethodCallContext) => {
  //   const calledMethod = ctx.IDENTIFIER();
  //   const [...methodParametersRaw] = ctx.expression();
  //   const methodParameters: Table<any>[] = methodParametersRaw.map((p) =>
  //     this.visit(p)
  //   );
  //   const methodHoldingClass = this.getCurrentScope();

  //   const referencedMethod = methodHoldingClass.find(
  //     calledMethod.text
  //   ) as MethodElement;

  //   // ERROR: The method does not exist in the class (self or not)
  //   if (!referencedMethod) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call non-existing method ${calledMethod.text} from class ${methodHoldingClass.tableName}`
  //     );
  //     return this.next(ctx);
  //   }

  //   const requiredMethodParameters: SymbolElement[] =
  //     referencedMethod.getParameters() ?? [];
  //   const sameNumberOfParameters =
  //     requiredMethodParameters.length === methodParameters.length;

  //   // ERROR: The method is called with a different number of parameters than it requires
  //   if (!sameNumberOfParameters) {
  //     this.addError(
  //       ctx,
  //       `Incorrect number of parameters for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredMethodParameters.length}, got ${methodParameters.length})`
  //     );
  //     return this.next(ctx);
  //   }

  //   for (let i = 0; i < requiredMethodParameters.length; i++) {
  //     const requiredParameterType = requiredMethodParameters[i].getType();
  //     const methodParameterType = methodParameters[i];
  //     const [allowed] =
  //       requiredParameterType.allowsAssignmentOf(methodParameterType);
  //     // ERROR: The parameter required is not the same as the one passed
  //     if (!allowed) {
  //       this.addError(
  //         ctx,
  //         `Incorrect type of parameter ${requiredMethodParameters[i].name} for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredParameterType.tableName}, got ${methodParameterType.tableName})`
  //       );
  //     }
  //   }
  //   return referencedMethod.getType();
  // };

  // // The first if (the one on top of the stack) defines the type, the others follow it
  // visitIf = (ctx: IfContext) => {
  //   // Empty bodies are disallowed by the parser in itself
  //   const [condition, body, elses] = ctx.expression();
  //   const conditionType = this.visit(condition);
  //   const boolTable: Table<boolean> = this.findTable("Bool")!;

  //   // ERROR: Condition can't be resolved to boolean
  //   if (!boolTable.allowsAssignmentOf(conditionType)) {
  //     this.addError(
  //       ctx,
  //       `Condition in if statement can't be resolved to boolean (got ${conditionType.tableName})`
  //     );
  //   }
  //   const thisIfType = this.visit(body);
  //   const elseBodiesType = this.visit(elses);
  //   // ERROR: If and else bodies don't have the same type
  //   const [allowsAssignment] = thisIfType.allowsAssignmentOf(elseBodiesType);
  //   const isAncestor = thisIfType.isAncestorOf(elseBodiesType);
  //   if (!allowsAssignment && !isAncestor) {
  //     this.addError(
  //       ctx,
  //       `If and else bodies don't have the same type (got ${thisIfType.tableName} and ${elseBodiesType.tableName})`
  //     );
  //   }
  //   return thisIfType;
  // };

  // visitWhile = (ctx: WhileContext) => {
  //   const expressionToCast = ctx.children?.[1];

  //   // There is no expression inside the while loop
  //   if (!expressionToCast) {
  //     return this.next(ctx);
  //   }
  //   const foundExpression: Table<boolean> = this.visit(expressionToCast);
  //   const boolTable = this.findTable("Bool")!;
  //   const [allowsAssignment] = boolTable.allowsAssignmentOf(foundExpression);
  //   // ERROR: The expression inside the while loop cannot be set as a boolean expression
  //   if (!allowsAssignment) {
  //     this.addError(
  //       ctx,
  //       `Expression inside while loop cannot be set as a boolean expression (got ${foundExpression.tableName})`
  //     );
  //     this.next(ctx);
  //   }
  //   return this.findTable("Object")!;
  // };

  // visitBlock = (ctx: BlockContext) => {
  //   // Return only the last thing in the block
  //   const resultingExpression = this.visitChildren(ctx);
  //   if (!resultingExpression) {
  //     this.addError(ctx, "Empty code block");
  //     return undefined;
  //   }
  //   const lastChild = Array.isArray(resultingExpression)
  //     ? resultingExpression.at(-1)
  //     : resultingExpression;
  //   return lastChild;
  // };

  // visitLetIn = (ctx: LetInContext) => {
  //   return this.next(ctx);
  // };

  // visitNew = (ctx: NewContext) => {
  //   const instantiationOf = ctx.TYPE();
  //   // Find a table with the same name as the type of the instantiation
  //   const instantiationOfTable = this.findTable(instantiationOf);

  //   const currentClass = this.getCurrentScope();

  //   // ERROR: Trying to instantiate a non-existing class
  //   if (!instantiationOfTable) {
  //     this.addError(
  //       ctx,
  //       `Trying to instantiate a non-existing class ${instantiationOf.text}`
  //     );
  //     return undefined;
  //   }
  //   // ERROR: Trying to instantiate the class we're currently in
  //   else if (instantiationOfTable.tableName === currentClass.tableName) {
  //     this.addError(
  //       ctx,
  //       `Attempting to instantiate class ${currentClass.tableName} inside itself`
  //     );
  //     return undefined;
  //   }

  //   return instantiationOfTable;
  // };

  // visitNegative = (ctx: NegativeContext) => {
  //   const expressionRaw = ctx.expression();
  //   const expressionType: Table<any> = this.visit(expressionRaw);

  //   // ERROR: Expression can't be negated
  //   if (!expressionType.allowNegation) {
  //     this.addError(
  //       ctx,
  //       `Expression of type ${expressionType.tableName} can't be negated`
  //     );
  //   }
  //   return this.next(ctx);
  // };
  // visitIsvoid = (ctx: IsvoidContext) => {
  //   const expressionRaw = ctx.expression();
  //   const expressionType = this.visit(expressionRaw);
  //   const cantBeInstantiated = ["Int", "Bool", "String", "IO"];

  //   // ERROR: Something that can't be instantiated can't be void
  //   if (cantBeInstantiated.includes(expressionType.tableName)) {
  //     this.addError(
  //       ctx,
  //       `Something of type ${expressionType.tableName} can't be void (Make sure it can be instantiated with 'new')`
  //     );
  //   }
  //   return expressionType;
  // };
  // visitMultiply = (ctx: MultiplyContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value * rExpr.value);
  // };
  // visitDivision = (ctx: DivisionContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value / rExpr.value);
  // };
  // visitAdd = (ctx: AddContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value + rExpr.value);
  // };
  // visitMinus = (ctx: MinusContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value - rExpr.value);
  // };

  // // Less thans return booleans.
  // visitLessThan = (ctx: LessThanContext) => {
  //   const [leftChild, rightChild] = ctx.expression();
  //   const lExpr: Table<number> = this.visit(leftChild);
  //   const rExpr: Table<number> = this.visit(rightChild);

  //   const intTable = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );

  //     return undefined;
  //   }
  //   return this.findTable("Bool")!
  //     .copy()
  //     .setValue(lExpr.value < rExpr.value);
  // };

  // visitLessEqual = (ctx: LessEqualContext) => {
  //   // Must be done between two possible integers
  //   const [leftChild, rightChild] = ctx.expression();
  //   const lExpr: Table<number> = this.visit(leftChild);
  //   const rExpr: Table<number> = this.visit(rightChild);
  //   const { line, column } = this.lineAndColumn(ctx);

  //   const intTable = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return this.findTable("Bool")!
  //     .copy()
  //     .setValue(lExpr.value <= rExpr.value);
  // };
  // visitEqual = (ctx: EqualContext) => {
  //   // Must be done between two possible integers
  //   const [leftChild, rightChild] = ctx.expression();
  //   const lExpr: Table<number> = this.visit(leftChild);
  //   const rExpr: Table<number> = this.visit(rightChild);
  //   const { line, column } = this.lineAndColumn(ctx);

  //   const [allowed] = lExpr.allowsAssignmentOf(rExpr);
  //   const lAncestorOf = lExpr.isAncestorOf(rExpr);
  //   const rAncestorOf = rExpr.isAncestorOf(lExpr);

  //   // ERROR: If one of them is an ancestor of the other, they can be compared
  //   if (!allowed && !lAncestorOf && !rAncestorOf) {
  //     this.addError(
  //       ctx,
  //       `Cannot compare ${lExpr.tableName} and ${rExpr.tableName}`
  //     );
  //     return undefined;
  //   }
  //   return this.findTable("Bool")!.copy();
  // };
  // visitParentheses = (ctx: ParenthesesContext) => {
  //   return this.visit(ctx.expression());
  // };
  // visitId = (ctx: IdContext) => {
  //   // Find it in the scope
  //   const [name] = ctx.children!;
  //   if (name.text.toLocaleLowerCase() === "self") {
  //     return this.getCurrentScope();
  //   }
  //   const currentScope = this.getCurrentScope<Table<any> | MethodElement>()!;
  //   const foundSymbol = currentScope.find(name.text);
  //   // The ID is being used, but it wasn't defined yet
  //   if (!foundSymbol) {
  //     this.addError(
  //       ctx,
  //       `Symbol ${name.text} is not defined in scope ${currentScope.scope}`
  //     );
  //     return undefined;
  //   }
  //   return this.findTable(foundSymbol?.getType()!);
  // };
  // visitInt = (ctx: IntContext): Table<number> => {
  //   return this.findTable("Int")!.copy().setValue(parseInt(ctx.INT().text));
  // };

  // visitString = (ctx: StringContext): Table<string> => {
  //   return this.findTable("String")!.copy().setValue(ctx.STRING().text);
  // };
  // visitTrue = (_ctx: TrueContext): Table<boolean> => {
  //   return this.findTable("Bool")!.copy().setValue(true);
  // };
  // visitFalse = (_ctx: FalseContext): Table<boolean> => {
  //   return this.findTable("Bool")!.copy().setValue(false);
  // };
  // visitAssignment = (ctx: AssignmentContext) => {
  //   const assignmentTo = ctx.IDENTIFIER();
  //   const assignmentValue: Table<any> = this.visit(ctx.expression());
  //   const currentScope = this.getCurrentScope()!;
  //   const foundSymbolType: Table<any> | undefined = currentScope
  //     .find(assignmentTo.text)
  //     ?.getType();

  //   // ERROR: The variable does not exist yet
  //   if (!foundSymbolType) {
  //     this.addError(
  //       ctx,
  //       `Symbol ${assignmentTo.text} is not defined in scope ${currentScope.scope}`
  //     );
  //     return undefined;
  //   }

  //   const [canBeAssigned] = foundSymbolType.allowsAssignmentOf(assignmentValue);

  //   const isAncestor = foundSymbolType.isAncestorOf(assignmentValue);

  //   // ERROR: Value is not assignable to the variable
  //   if (!canBeAssigned && !isAncestor) {
  //     this.addError(
  //       ctx,
  //       `Cannot assign ${assignmentValue.tableName} to ${foundSymbolType.tableName} (Can't assign type ${assignmentValue.tableName} to ${foundSymbolType.tableName})`
  //     );
  //     return undefined;
  //   }

  //   return foundSymbolType;
  // };
  // visitMethod = (ctx: MethodContext) => {
  //   const methodFoundType = ctx.TYPE();
  //   const methodType =
  //     methodFoundType.text === "SELF_TYPE"
  //       ? this.getCurrentScope()
  //       : this.findTable(methodFoundType);
  //   // ERROR: The method type is not yet defined (if ever)
  //   if (!methodType) {
  //     this.addError(ctx, `Method type ${methodFoundType.text} is not defined`);
  //     return this.next(ctx);
  //   }

  //   const expressionRaw = ctx.expression()!; // If it doesn't exist, it is a syntax error
  //   const expressionType: Table<any> | undefined = this.visit(expressionRaw);
  //   // ERROR: If the expression is not valid, it will be null
  //   if (!expressionType) {
  //     this.addError(ctx, `Invalid expression (Can't determine type)`);
  //     return this.next(ctx);
  //   }

  //   const [canBeAssigned] = methodType.allowsAssignmentOf(expressionType);
  //   const isAncestor = methodType.isAncestorOf(expressionType);

  //   // ERROR: Last child and return type do not match or can't be assigned
  //   if (!canBeAssigned && !isAncestor) {
  //     this.addError(
  //       ctx,
  //       `Cannot assign ${expressionType.tableName} to ${methodType.tableName} (Can't assign type ${expressionType.tableName} to ${methodType.tableName})`
  //     );
  //     return this.next(ctx);
  //   }

  //   const currentTable = this.getCurrentScope()!;
  //   const { line, column } = this.lineAndColumn(ctx);
  //   const newMethod = new MethodElement()
  //     .setColumn(column)
  //     .setLine(line)
  //     .setName(ctx.IDENTIFIER().text)
  //     .setType(methodType)
  //     .setScope(this.getCurrentScope()!.tableName ?? "Global")
  //     .setParentTable(methodType);

  //   const formalParameters = ctx.formal();
  //   this.scopeStack.push(newMethod);
  //   for (const param of formalParameters) {
  //     const newParam = this.visit(param);
  //     newMethod.addParameter(newParam);
  //   }
  //   this.scopeStack.pop();
  //   currentTable.addElement(newMethod);

  //   return methodType;
  // };
  // visitProperty = (ctx: PropertyContext) => {
  //   // Previous table
  //   const name = ctx.IDENTIFIER();
  //   const dataType = ctx.TYPE();
  //   const assignmentExpression = ctx.expression();

  //   const previousClass: Table<any> | undefined = this.findTable(dataType);
  //   const previousClassCopy = previousClass?.copy(); // Create a copy that can go out of scope
  //   const { line, column } = this.lineAndColumn(ctx);

  //   // ERROR: The type is not yet defined
  //   if (!previousClass) {
  //     this.addError(ctx, `Type ${dataType.text} is not (yet?) defined`);
  //     return this.next(ctx);
  //   }

  //   if (assignmentExpression) {
  //     const resolvesTo: Table<any> = this.visit(assignmentExpression);

  //     const [allowedAssigmentTo] = previousClass.allowsAssignmentOf(resolvesTo);
  //     // ERROR: Not allowed an assignment and the assignment is not to an ancestor
  //     if (!allowedAssigmentTo && !previousClass?.isAncestorOf(resolvesTo)) {
  //       this.addError(
  //         ctx,
  //         `Cannot assign ${resolvesTo?.tableName ?? "erroneous class"} to ${
  //           previousClass.tableName
  //         } (Can't assign type ${resolvesTo?.tableName ?? ""} to ${
  //           previousClass.tableName
  //         })`
  //       );
  //       return this.next(ctx);
  //     }
  //     previousClassCopy!.setValue(resolvesTo?.value);
  //   }
  //   const currentScopeTable = this.getCurrentScope();

  //   // const previousDeclared = currentScopeTable?.find(variableName);
  //   const newTableElement = new SymbolElement()
  //     .setColumn(column)
  //     .setLine(line)
  //     .setName(name.text)
  //     .setType(previousClass)
  //     .setScope(currentScopeTable?.tableName ?? "Global")
  //     .setValue(
  //       previousClassCopy?.value ??
  //         previousClass.convertToType(assignmentExpression?.text) ??
  //         previousClass.defaultValue ??
  //         undefined
  //     );

  //   const previousDeclared = currentScopeTable.find(name.text);
  //   // Case 1: Overriding (It does nothing)
  //   if (previousDeclared) {
  //     // ERROR: This name was previously defined
  //     if (previousDeclared.getScope() === newTableElement.getScope()) {
  //       // ERROR: Redefinition of a variable in the same scope
  //       if (
  //         previousDeclared.getDataStructureType() ===
  //         newTableElement.getDataStructureType()
  //       ) {
  //         this.addError(ctx, `Redefinition of ${name.text} in the same scope`);
  //         return this.next(ctx);
  //       }
  //       // ERROR: Definition of a variable with the name of a method, or viseversa
  //       else {
  //         this.addError(
  //           ctx,
  //           `Redefinition of ${name.text} in the same scope as a method and a variable`
  //         );
  //         return this.next(ctx);
  //       }
  //     }

  //     // ERROR: The variable was defined in a parent scope, but the definition type is not the same
  //     // else if (previousDeclared.getType() !== newTableElement.getType()) {

  //     // }
  //   }

  //   // Case 2: Declaration of a new property
  //   currentScopeTable.addElement(newTableElement);
  //   return this.next(ctx);
  // };
  // visitClasses = (ctx: ClassesContext) => {
  //   return this.next(ctx);
  // };
  // visitEof = (ctx: EofContext) => {
  //   return this.next(ctx);
  // };
  // visitProgram = (ctx: ProgramContext) => {
  //   return this.next(ctx);
  // };
  // visitProgramBlocks = (ctx: ProgramBlocksContext) => {
  //   return this.next(ctx);
  // };
  // visitFeature = (ctx: FeatureContext) => {
  //   return this.next(ctx);
  // };
  // visitFormal = (ctx: FormalContext) => {
  //   const name = ctx.IDENTIFIER();
  //   const datatype = ctx.TYPE();
  //   const foundTable = this.findTable(datatype);

  //   // ERROR: The type is not yet defined
  //   if (!foundTable) {
  //     this.addError(ctx, `Type ${datatype.text} is not (yet?) defined`);
  //     return undefined;
  //   }

  //   const { line, column } = this.lineAndColumn(ctx);
  //   const newSymbol = new SymbolElement()
  //     .setColumn(column)
  //     .setLine(line)
  //     .setName(name.text)
  //     .setType(foundTable);
  //   return newSymbol;
  // };
  // visitExpression = (ctx: ExpressionContext) => {
  //   return this.next(ctx);
  // };
}
