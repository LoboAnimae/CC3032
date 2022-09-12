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
  SymbolElement,
  Table,
  TableElement,
  Properties,
} from "./DataStructures/Table";
import { PropertyContextHelper } from "./yaplCheckpoint";

enum Scope {
  Global = 1,
  General,
}

export class YaplVisitor
  extends AbstractParseTreeVisitor<Properties<any> | any>
  implements yaplVisitor<Properties<any> | any>
{
  public scopeStack: Stack<Table<any>>;
  public symbolsTable: Table<any>[];
  public mainExists: boolean = false;
  public mainMethodExists: boolean = false;
  public errors: ErrorsTable;
  public warnings: ErrorsTable;
  constructor() {
    super();
    this.scopeStack = new Stack<Table<any>>(); // Scopes are implemented as a stack.
    this.symbolsTable = []; // Symbols are universal
    this.errors = new ErrorsTable();
    this.warnings = new ErrorsTable("Warning", "33");

    const IntType = new Table<number>({
      errors: this.errors,
      warnings: this.warnings,
      scope: "Int",
      isGeneric: true,
      canBeComparedTo: ["Bool"],
      defaultValue: 0,
      assigmentFunction: () =>
        function (input: Table<any>) {
          if (input.tableName === "Int") {
            return [true];
          }
          if (input.tableName === "Bool") {
            // TODO: Generate a warning here
            return [true];
          }
          return [false];
        },
      comparisonFunction: () =>
        function (against: Table<any>) {
          if (against.tableName === "Int") {
            return [true];
          } else if (against.tableName === "Bool") {
            // TODO: Add a warning here
            return [true];
          }
          return [false];
        },
      typeCohersionFunction: () => (input: any) => Number(input),
    });

    const BoolType = new Table<boolean>({
      errors: this.errors,
      warnings: this.warnings,
      scope: "Bool",
      isGeneric: true,
      canBeComparedTo: ["Int"],
      defaultValue: false,
      assigmentFunction: () =>
        function (input: Table<any>) {
          if (input.tableName === "Bool") {
            return [true];
          }
          if (input.tableName === "Int") {
            // TODO: Generate a warning here
            return [[0, 1].includes(input.value)];
          }
          return [false];
        },
      comparisonFunction: () =>
        function (against: Table<any>) {
          if (against.tableName === "Bool") {
            return [true];
          } else if (against.tableName === "Int") {
            // TODO: Add a warning here
            return [true];
          }
          return [false];
        },
      typeCohersionFunction: () => (input: any) => Boolean(input),
    });
    const StringType = new Table<string>({
      scope: "String",
      isGeneric: true,
      defaultValue: "",
      assigmentFunction: () =>
        function (input: Table<any>) {
          return [input.tableName === "String"];
        },
      comparisonFunction: () => () => [false],
    });
    const lengthMethod = new MethodElement()
      .setName("length")
      .setReturnType(IntType);

    const concatMethod = new MethodElement()
      .setName("concat")
      .setReturnType(StringType)
      .addParameter({ name: "s", type: "String" });

    const substrMethod = new MethodElement()
      .setName("substr")
      .setReturnType(StringType)
      .addParameter({ name: "i", type: "Int" })
      .addParameter({ name: "l", type: "Int" });

    StringType.symbols.push(lengthMethod, concatMethod, substrMethod);
    const IOType = new Table<undefined>({
      scope: "IO",
      isGeneric: true,
      defaultValue: undefined,
    });

    const outStringMethod = new MethodElement()
      .setName("out_string")
      .setReturnType(IOType)
      .addParameter({ name: "x", type: "String" });

    const outIntMethod = new MethodElement()
      .setName("out_int")
      .setReturnType(IOType)
      .addParameter({ name: "x", type: "Int" });

    const inStringMethod = new MethodElement()
      .setName("in_string")
      .setReturnType(StringType);

    const inIntMethod = new MethodElement()
      .setName("in_int")
      .setReturnType(IntType);

    IOType.addElement(
      outStringMethod,
      outIntMethod,
      inStringMethod,
      inIntMethod
    );
    const ObjectType = new Table<{}>({
      scope: "Object",
      defaultValue: {},
      assigmentFunction: () => (input: Table<any>) => {
        // @ts-ignore
        return [this.tableName === input.tableName];
      },
      comparisonFunction: () => () => [false],
    });

    const abortMethod = new MethodElement()
      .setReturnType(ObjectType)
      .setName("abort");

    const typeNameMethod = new MethodElement()
      .setReturnType(StringType)
      .setName("type_name");

    const copyMethod = new MethodElement()
      .setReturnType(ObjectType)
      .setName("copy");

    ObjectType.addElement(abortMethod, typeNameMethod, copyMethod);
    //#endregion
    this.scopeStack.push(ObjectType);
    this.symbolsTable.push(IntType, BoolType, StringType, IOType, ObjectType);
  }
  defaultResult(): number {
    return 0;
  }

  aggregateResult(aggregate: number, nextResult: number): number {
    return aggregate + nextResult;
  }

  lineAndColumn = (ctx: any) => ({
    line: ctx.start?.line ?? 0,
    column: {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
    },
  });

  protected findTable(name: string | Table<any> | any): Table<any> | undefined {
    if (typeof name === "string") {
      return this.symbolsTable.find(
        (table: Table<any>) => table.scope === name
      );
    } else if (name instanceof Table) {
      return this.symbolsTable.find(
        (table: Table<any>) => table.scope === name.scope
      );
    } else if (name) {
      return this.symbolsTable.find(
        (table: Table<any>) => table.scope === name.text ?? name.toString()
      );
    }
    return undefined;
  }

  protected returnToScope(scope: Scope) {
    while (this.scopeStack.size() > scope) {
      this.scopeStack.pop();
    }
  }

  next = (ctx: any) => 1 + super.visitChildren(ctx);

  private returnToGlobalScope() {
    this.returnToScope(Scope.Global);
  }

  // The second scope in the stack is always a class
  private getCurrentClass(): Table<any> {
    return this.scopeStack.getItem(1);
  }
  visitClassDefine = (ctx: ClassDefineContext): number => {
    this.returnToGlobalScope();
    const [cls, inheritsFrom = "Object"] = ctx.TYPE();
    const classTable = this.findTable(cls);
    const { line, column } = this.lineAndColumn(ctx);

    /*

    Circular inheritance is not possible, thanks to the syntax of the language.
    Not Possible:
      class A inherits B
      class B inherits A

    Why:
      For the class A to inherit from B, it must first be defined, 
      but for B to inherit from A, it must first be defined, which 
      is impossible.
    */

    // ERROR: Class inherits from itself
    if (cls == inheritsFrom) {
      return this.next(ctx);
    }

    // ERROR: Class already exists
    if (classTable) {
      return this.next(ctx);
    }

    const parentTable = this.findTable(inheritsFrom);
    const newTable = new Table({
      scope: cls.text,
      parentTable,
      line,
      column,
      defaultValue: {},
    });

    // ERROR: Trying to inherit from a non-existing class
    if (!parentTable) {
    }

    // ERROR: The table can't be inherited
    else if (!parentTable.canBeInherited) {
    }

    if (newTable.tableName === "Main") {
      // ERROR: Main class is declared more than once
      if (this.mainExists) {
        return this.next(ctx);
      }
      this.mainExists = this.mainExists || cls.text === "Main";
      // ERROR: Main class is trying to inherit from another class, which is not allowed
      if (parentTable?.tableName !== "Object") {
      }
    }

    // Push the table to the stack and the table to the list of tables
    this.symbolsTable.push(newTable);
    this.scopeStack.push(newTable);
    return this.next(ctx);
  };

  visitMethodCall = (ctx: MethodCallContext) => {
    return this.next(ctx);
  };
  visitOwnMethodCall = (ctx: OwnMethodCallContext) => {
    return this.next(ctx);
  };
  visitIf = (ctx: IfContext) => {
    return this.next(ctx);
  };
  visitWhile = (ctx: WhileContext) => {
    const expressionToCast = ctx.children?.[1];
    const { line, column } = this.lineAndColumn(ctx);

    // There is no expression inside the while loop
    if (!expressionToCast) {
      return this.next(ctx);
    }
    const foundExpression: Table<boolean> = this.visit(expressionToCast);
    const boolTable = this.findTable("Bool")!;
    const [allowsAssignment] = boolTable.allowsAssignmentOf(foundExpression);
    // ERROR: The expression inside the while loop cannot be set as a boolean expression
    if (!allowsAssignment) {
      this.next(ctx);
    }
    return this.next(ctx);
  };
  visitBlock = (ctx: BlockContext) => {
    const parentContext = ctx.parent?.children?.[0];
    // Case 1: The block is inside a while loop
    if (parentContext?.text?.toLocaleLowerCase() === "while") {
    }
    // Case 2: The block is inside an if statement
    else if (parentContext?.text?.toLocaleLowerCase() === "if") {
    }
    // Case 3: The block is inside a method
    else {
      // Expect the block to be inside a method
      // If it is a method, return the last statement's return value
      const lastChildRaw = ctx.children?.[ctx.children.length - 3];
      // ERROR: No statements inside the method. Let the method manage the error.
      if (!lastChildRaw) {
        return null;
      }
      // Allow for a table of the last value to be returned. Let the method manage the table.
      return this.visit(lastChildRaw);
    }

    return this.next(ctx);
  };
  visitLetIn = (ctx: LetInContext) => {
    return this.next(ctx);
  };
  visitNew = (ctx: NewContext) => {
    const instantiationOf = ctx.TYPE().toString();
    // Find a table with the same name as the type of the instantiation
    const table = this.findTable(instantiationOf);
    const parentName = this.getCurrentClass()?.tableName;
    const { line, column } = this.lineAndColumn(ctx);

    // ERROR: Trying to instantiate a non-existing class
    if (!table) {
      return this.next(ctx);
    }
    // ERROR: Trying to instantiate the class we're currently in
    else if (table.tableName === parentName) {
      return this.next(ctx);
    }
    return this.next(ctx);
  };
  visitNegative = (ctx: NegativeContext) => {
    return this.next(ctx);
  };
  visitIsvoid = (ctx: IsvoidContext) => {
    return this.next(ctx);
  };
  visitMultiply = (ctx: MultiplyContext) => {
    return this.next(ctx);
  };
  visitDivision = (ctx: DivisionContext) => {
    return this.next(ctx);
  };
  visitAdd = (ctx: AddContext) => {
    const lExpr: Table<any> = this.visit(ctx.children![0]!);
    const rExpr: Table<any> = this.visit(ctx.children![2]!);

    const intTable: Table<number> = this.findTable("Int")!.copy();

    const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
    const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

    // ERROR: One of the expressions cannot be set as an integer
    if (!lCanBeInt || !rCanBeInt) {
      return undefined;
    }
    return intTable.setValue(lExpr.value + rExpr.value);
  };
  visitMinus = (ctx: MinusContext) => {
    const lExpr: Table<any> = this.visit(ctx.children![0]!);
    const rExpr: Table<any> = this.visit(ctx.children![2]!);

    const intTable: Table<number> = this.findTable("Int")!.copy();

    const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
    const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

    // ERROR: One of the expressions cannot be set as an integer
    if (!lCanBeInt || !rCanBeInt) {
      return undefined;
    }
    return intTable.setValue(lExpr.value - rExpr.value);
  };

  // Less thans return booleans
  visitLessThan = (ctx: LessThanContext) => {
    // Must be done between two possible integers
    const lExpr: Table<number> = this.visit(ctx.children?.[0]!);
    const rExpr: Table<number> = this.visit(ctx.children?.[2]!);
    const { line, column } = this.lineAndColumn(ctx);

    const intTable = this.findTable("Int")!.copy();

    const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
    const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

    // ERROR: One of the expressions cannot be set as an integer
    if (!lCanBeInt || !rCanBeInt) {
      return undefined;
    }
    return this.findTable("Bool")!
      .copy()
      .setValue(lExpr.value < rExpr.value);
  };
  visitLessEqual = (ctx: LessEqualContext) => {
    // Must be done between two possible integers
    const lExpr: Table<number> = this.visit(ctx.children?.[0]!);
    const rExpr: Table<number> = this.visit(ctx.children?.[2]!);
    const { line, column } = this.lineAndColumn(ctx);

    const intTable = this.findTable("Int")!.copy();

    const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
    const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

    // ERROR: One of the expressions cannot be set as an integer
    if (!lCanBeInt || !rCanBeInt) {
      return undefined;
    }
    return this.findTable("Bool")!
      .copy()
      .setValue(lExpr.value <= rExpr.value);
  };
  visitEqual = (ctx: EqualContext) => {
    return this.next(ctx);
  };
  visitBoolNot = (ctx: BoolNotContext) => {
    return this.next(ctx);
  };
  visitParentheses = (ctx: ParenthesesContext) => {
    return this.visit(ctx.expression());
  };
  visitId = (ctx: IdContext) => {
    // Find it in the scope
    const [name] = ctx.children!;
    const currentScope = this.getCurrentClass()!;
    const foundSymbol = currentScope.find(name.text);
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.stop?.charPositionInLine ?? 0,
    };
    // The ID is being used, but it wasn't defined yet
    if (!foundSymbol) {
      return undefined;
    }
    return this.findTable(foundSymbol?.getType()!);
  };
  visitInt = (ctx: IntContext): Table<number> => {
    return this.findTable("Int")!.copy().setValue(parseInt(ctx.INT().text));
  };

  visitString = (ctx: StringContext): Table<string> => {
    return this.findTable("String")!.copy().setValue(ctx.STRING().text);
  };
  visitTrue = (_ctx: TrueContext): Table<boolean> => {
    return this.findTable("Bool")!.copy().setValue(true);
  };
  visitFalse = (_ctx: FalseContext): Table<boolean> => {
    return this.findTable("Bool")!.copy().setValue(false);
  };
  visitAssignment = (ctx: AssignmentContext) => {
    return this.next(ctx);
  };
  visitMethod = (ctx: MethodContext) => {
    const methodFoundType = ctx.TYPE();
    if (!methodFoundType) {
      return this.next(ctx);
    }

    const methodType = this.findTable(methodFoundType.text!);
    // ERROR: The method type is not yet defined (if ever)
    if (!methodType) {
      return this.next(ctx);
    }

    const expressionRaw = ctx.expression()!; // If it doesn't exist, it is a syntax error
    const expressionType: Table<any> | null = this.visit(expressionRaw);
    // ERROR: If the expression is not valid, it will be null
    if (!expressionType) {
      return this.next(ctx);
    }
    const [expressionAllowsAssignment] =
      expressionType?.allowsAssignmentOf(methodType);
    // ERROR: The expression type is not the same as the method type and can't be casted
    if (!expressionAllowsAssignment) {
    }

    return this.next(ctx);
  };
  visitProperty = (ctx: PropertyContext) => {
    // Previous table
    const name = ctx.IDENTIFIER();
    const dataType = ctx.TYPE();
    const assignmentExpression = ctx.expression();

    const previousClass: Table<any> | undefined = this.findTable(dataType);
    const previousClassCopy = previousClass?.copy(); // Create a copy that can go out of scope
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
    };

    // ERROR: The type is not yet defined
    if (!previousClass) {
      return this.next(ctx);
    }

    if (assignmentExpression) {
      const resolvesTo: Table<any> = this.visit(assignmentExpression);
      const [allowedAssigment] = previousClass.allowsAssignmentOf(resolvesTo);
      // ERROR: Not allowed an assignment
      if (!allowedAssigment) {
      }
      previousClassCopy!.setValue(resolvesTo.value);
    }
    const currentScopeTable = this.getCurrentClass();

    // const previousDeclared = currentScopeTable?.find(variableName);
    const newTableElement = new SymbolElement()
      .setColumn(column)
      .setLine(line)
      .setName(name.text)
      .setType(previousClass)
      .setScope(currentScopeTable?.tableName ?? "Global")
      .setValue(
        previousClassCopy?.value ??
          previousClass.convertToType(assignmentExpression?.text) ??
          previousClass.defaultValue ??
          undefined
      );

    const previousDeclared = currentScopeTable.find(name.text);
    // Case 1: Overriding (It does nothing)
    if (previousDeclared) {
      // ERROR: This name was previously defined
      if (previousDeclared.getScope() === newTableElement.getScope()) {
        // ERROR: Redefinition of a variable in the same scope
        if (
          previousDeclared.getDataStructureType() ===
          newTableElement.getDataStructureType()
        ) {
        }
        // ERROR: Definition of a variable with the name of a method, or viseversa
        else {
        }
      }

      // ERROR: The variable was defined in a parent scope, but the definition type is not the same
      else if (previousDeclared.getType() !== newTableElement.getType()) {
      }
      return this.next(ctx);
    }

    // Case 2: Declaration of a new property
    currentScopeTable.addElement(newTableElement);
    return this.next(ctx);
  };
  visitClasses = (ctx: ClassesContext) => {
    return this.next(ctx);
  };
  visitEof = (ctx: EofContext) => {
    return this.next(ctx);
  };
  visitProgram = (ctx: ProgramContext) => {
    return this.next(ctx);
  };
  visitProgramBlocks = (ctx: ProgramBlocksContext) => {
    return this.next(ctx);
  };
  visitFeature = (ctx: FeatureContext) => {
    return this.next(ctx);
  };
  visitFormal = (ctx: FormalContext) => {
    return this.next(ctx);
  };
  visitExpression = (ctx: ExpressionContext) => {
    return this.next(ctx);
  };
}
