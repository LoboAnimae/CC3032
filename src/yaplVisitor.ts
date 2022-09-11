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
  constructor() {
    super();
    this.scopeStack = new Stack<Table<any>>(); // Scopes are implemented as a stack.
    this.symbolsTable = []; // Symbols are universal
    this.errors = new ErrorsTable();

    //#region Int
    // Int doesn't depend on any other class, so it's added first to the stack
    const IntType = new Table<number>({
      scope: "Int",
      isGeneric: true,
      canBeComparedTo: ["Bool"],
      defaultValue: 0,
    });
    //#endregion
    //#region Bool
    // Bool doesn't depend on any other class, so it's added to the stack with Int
    const BoolType = new Table<boolean>({
      scope: "Bool",
      isGeneric: true,
      canBeComparedTo: ["Int"],
      defaultValue: false,
    });
    //#endregion
    //#region String
    // String depends on Int, so it's added second to the stack
    const StringType = new Table<string>({
      scope: "String",
      isGeneric: true,
      defaultValue: "",
    });
    const lengthMethod = new MethodElement()
      .setName("length")
      .setReturnType("Int");

    const concatMethod = new MethodElement()
      .setName("concat")
      .setReturnType("String")
      .addParameter({ name: "s", type: "String" });

    const substrMethod = new MethodElement()
      .setName("substr")
      .setReturnType("String")
      .addParameter({ name: "i", type: "Int" })
      .addParameter({ name: "l", type: "Int" });

    StringType.symbols.push(lengthMethod, concatMethod, substrMethod);
    //#endregion

    //#region IO
    // IO depends on String and Int, so it's added third to the stack
    const IOType = new Table<undefined>({
      scope: "IO",
      isGeneric: true,
      defaultValue: undefined,
    });

    const outStringMethod = new MethodElement()
      .setName("out_string")
      .setReturnType("IO")
      .addParameter({ name: "x", type: "String" });

    const outIntMethod = new MethodElement()
      .setName("out_int")
      .setReturnType("IO")
      .addParameter({ name: "x", type: "Int" });

    const inStringMethod = new MethodElement()
      .setName("in_string")
      .setReturnType("String");

    const inIntMethod = new MethodElement()
      .setName("in_int")
      .setReturnType("Int");

    IOType.addElement(
      outStringMethod,
      outIntMethod,
      inStringMethod,
      inIntMethod
    );
    //#endregion
    //#region Object
    // Object depends on String, so it's added last
    const ObjectType = new Table<{}>({ scope: "Object", defaultValue: {} });

    const abortMethod = new MethodElement()
      .setReturnType("Object")
      .setName("abort");

    const typeNameMethod = new MethodElement()
      .setReturnType("String")
      .setName("type_name");

    const copyMethod = new MethodElement()
      .setReturnType("Object")
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

  protected findTable(name: string): Table<any> | undefined {
    return this.symbolsTable.find((table: Table<any>) => table.scope === name);
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
    this.returnToGlobalScope(); // Return to the global scope, since classes can only be defined in the global scope.
    // Case 1: Simple class
    // Case 2: Class inherits from another class
    // Case 3: Class inherits from a non-allowed class
    const className = ctx.TYPE()[0].toString();
    // Check if the class already exists
    const classTable = this.findTable(className);
    const { symbol } = ctx.TYPE()[0];

    const start = symbol.startIndex;
    const end = symbol.stopIndex;
    const line = symbol.line;
    const column = { start, end };
    const inheritsFrom = ctx.TYPE().at(1)?.toString() || "Object";

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
    if (className === inheritsFrom) {
      this.errors.addError({
        message: ErrorsTable.quotedErrorFormat(
          "{} Class {} can't inherit from itself",
          "Recursive Inheritance:",
          className
        ),
        line,
        column,
      });
      return this.next(ctx);
    }

    // If the table was previously defined, then it means there is another class with the same name
    if (classTable) {
      const message = classTable.isGeneric
        ? ErrorsTable.quotedErrorFormat(
            "Can't redefine generic class {}",
            className
          )
        : ErrorsTable.quotedErrorFormat("Redefinition of class {}", className);
      this.errors.addError({ message, line, column });
      return this.next(ctx);
    }

    const parentTable = this.findTable(inheritsFrom);
    const newTable = new Table({
      scope: className,
      parentTable,
      line,
      column,
      defaultValue: {},
    });

    // If the parent table doesn't exist, then it means that the class inherits from a non-existing class
    if (!parentTable) {
      const message = ErrorsTable.quotedErrorFormat(
        `{} attempted to inherit from class {}, but it does not exist.`,
        className,
        inheritsFrom
      );
      this.errors.addError({ message, line, column });
    }
    // If the parent table is not allowed to be inherited, then it means that the class inherits from a non-allowed class
    else if (!parentTable.canBeInherited) {
      const message = parentTable.isGeneric
        ? ErrorsTable.quotedErrorFormat(
            `Class {} can't inherit from generic class {}`,
            className,
            inheritsFrom
          )
        : ErrorsTable.quotedErrorFormat(
            `Class {} can't inherit from class {}`,
            className,
            inheritsFrom
          );
      this.errors.addError({ message, line, column });
    }

    // If main exists and this class is Main, then it means that there are two main classes
    if (className === "Main" && this.mainExists) {
      const message = ErrorsTable.quotedErrorFormat(
        "Redefinition of class {}",
        "Main"
      );
      this.errors.addError({ message, line, column });
      return this.next(ctx);
    }
    this.mainExists = this.mainExists || className === "Main";

    // Class "Main" must inherit from "Object"
    if (newTable.tableName === "Main" && parentTable?.tableName !== "Object") {
      this.errors.addError({
        message: ErrorsTable.errorFormat(
          `{} class must not inherit from anywhere.`,
          "Main"
        ),
        line,
        column,
      });
      return this.next(ctx);
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
    const line = ctx.start?.line ?? 0;
    const start = ctx.start?.charPositionInLine ?? 0;
    const end = start + ctx.text.length;
    const column = { start, end };

    if (!expressionToCast) {
      const message = ErrorsTable.errorFormat(
        "Missing expression in While loop"
      );
      this.errors.addError({ message, line, column });
      return this.next(ctx);
    } else {
      const foundExpression = this.visit(expressionToCast);
    }

    return this.next(ctx);
  };
  visitBlock = (ctx: BlockContext) => {
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
    const { symbol } = ctx.TYPE();
    const start = symbol.charPositionInLine;
    const end = start + (symbol.text?.length ?? 0);
    const line = symbol.line;
    const column = { start, end };
    if (!table) {
      const message = ErrorsTable.quotedErrorFormat(
        "Instantiation of class {}, which not exist (yet?)",
        instantiationOf
      );
      this.errors.addError({ message, line, column });
    } else if (table.tableName === parentName) {
      const message = ErrorsTable.quotedErrorFormat(
        "Instantiation of class {} inside itself",
        instantiationOf
      );
      this.errors.addError({ message, line, column });
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
  visitAdd = (ctx: AddContext): Properties<number> => {
    const leftExpression: Properties<number> = this.visit(ctx.children?.[0]!);
    const visitRightExpression: Properties<number> = this.visit(
      ctx.children?.[2]!
    );
    const expr = new Properties<number>({ type: "Int" });
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.stop?.charPositionInLine ?? 0,
    };

    if (!(leftExpression.canBeInteger && visitRightExpression.canBeInteger)) {
      let message = "";
      const leftIsInteger = leftExpression.canBeInteger;
      const rightIsInteger = visitRightExpression.canBeInteger;

      if (!leftIsInteger && !rightIsInteger) {
        message = ErrorsTable.quotedErrorFormat(
          "Both operands of '+' must be integers ({} and {} are not integers, and can't be casted)",
          ctx.children?.[0]!.text,
          ctx.children?.[2]!.text
        );
      } else if (!leftIsInteger) {
        message = ErrorsTable.quotedErrorFormat(
          "Left operand of '+' must be an integer ({} is not an integer and can't be casted)",
          ctx.children?.[0]!.text
        );
      } else if (!rightIsInteger) {
        message = ErrorsTable.quotedErrorFormat(
          "Right operand of '+' must be an integer ({} is not an integer and can't be casted)",
          ctx.children?.[2]!.text
        );
      } else {
        message = ErrorsTable.quotedErrorFormat(
          "Unknown error while evaluating expression {}",
          ctx.text
        );
      }
      this.errors.addError({ message, line, column });
    }

    return expr;
  };
  visitMinus = (ctx: MinusContext) => {
    return this.next(ctx);
  };

  // Less thans return booleans
  visitLessThan = (ctx: LessThanContext): Properties<any> => {
    const boolTable = this.findTable("Bool")!;
    const [leftChild, _, rightChild] = ctx.children!;
    const visitLeftExpression: Properties<number> = this.visit(leftChild);
    const visitRightExpression: Properties<number> = this.visit(rightChild);
    const expr = new Properties({ type: ["Bool"] });

    if (visitLeftExpression.canBeComparedTo(visitRightExpression)) {
      // Don't assign the properties unless the expressions are comparable
      expr
        .allowCompared(boolTable.canBeComparedTo)
        .allowEquated(boolTable.canBeComparedTo)
        // Can be either 0 or 1
        .allowInteger(
          Number(
            visitLeftExpression.asInteger && visitRightExpression.asInteger
          )
        );
    } else {
      const message = ErrorsTable.quotedErrorFormat(
        "Expression {} can't be compared",
        ctx.text
      );
      this.errors.addError({
        message,
        line: ctx.start?.line ?? 0,
        column: {
          start: ctx.start?.charPositionInLine ?? 0,
          end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
        },
      });
    }
    return expr;
  };
  visitLessEqual = (ctx: LessEqualContext) => {
    // const visitLeftExpression: Properties<number> = this.visit(
    //   ctx.children?.[0]!
    // );
    // const visitRightExpression: Properties<number> = this.visit(
    //   ctx.children?.[2]!
    // );
    // const expr = new Properties({ type: "Bool" });
    // if (
    //   visitLeftExpression.canBeCompared &&
    //   visitRightExpression.canBeCompared
    // ) {
    //   // Don't assign the properties unless the expressions are comparable
    //   expr
    //     // Obviously, it can be a boolean
    //     .allowBoolean(true)
    //     // A less than can be compared as an integer, since it is a boolean (0 or 1)
    //     .allowCompared()
    //     // A true and a false can be compared as an integer, since it is a boolean (0 or 1)
    //     .allowEquated((input) => false)
    //     // Can be either 0 or 1
    //     .allowInteger(
    //       Number(
    //         visitLeftExpression.asInteger && visitRightExpression.asInteger
    //       )
    //     );
    //   // First piece of optimization
    //   if (
    //     visitLeftExpression.resolvedAtCompileTime &&
    //     visitRightExpression.resolvedAtCompileTime
    //   ) {
    //     const compileTimeExpr =
    //       visitLeftExpression.asInteger <= visitRightExpression.asInteger;
    //     expr.allowBoolean(compileTimeExpr).allowCompiledTime(compileTimeExpr);
    //   }
    // } else {
    //   const message = ErrorsTable.quotedErrorFormat(
    //     "Expression {} can't be compared",
    //     ctx.text
    //   );
    //   this.errors.addError({
    //     message,
    //     line: ctx.start?.line ?? 0,
    //     column: {
    //       start: ctx.start?.charPositionInLine ?? 0,
    //       end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
    //     },
    //   });
    // }
    // return expr;
  };
  visitEqual = (ctx: EqualContext) => {
    // const visitLeftExpression: Properties<any> = this.visit(ctx.children?.[0]!);
    // const visitRightExpression: Properties<any> = this.visit(
    //   ctx.children?.[2]!
    // );
    // const expr = new Properties({ type: "Bool" });
    // if (visitLeftExpression.canBeEquated && visitRightExpression.canBeEquated) {
    //   const canBeInteger =
    //     visitLeftExpression.asInteger && visitRightExpression.asInteger;
    //   const canBeBoolean =
    //     visitLeftExpression.asBoolean && visitRightExpression.asBoolean;
    //   const canBeString =
    //     visitLeftExpression.asString && visitRightExpression.asString;
    //   if (canBeInteger || canBeBoolean) {
    //   }
    //   if (canBeString) {
    //   } else {
    //   }
    //   // Don't assign the properties unless the expressions are comparable
    //   expr
    //     // Obviously, it can be a boolean
    //     .allowBoolean(true)
    //     // A less than can be compared as an integer, since it is a boolean (0 or 1)
    //     // .allowCompared()
    //     // A true and a false can be compared as an integer, since it is a boolean (0 or 1)
    //     // .allowEquated((input) => false);
    // } else {
    //   const message = ErrorsTable.quotedErrorFormat(
    //     "Expression {} can't be equated",
    //     ctx.text
    //   );
    //   this.errors.addError({
    //     message,
    //     line: ctx.start?.line ?? 0,
    //     column: {
    //       start: ctx.start?.charPositionInLine ?? 0,
    //       end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
    //     },
    //   });
    // }
    // return expr;
  };
  visitBoolNot = (ctx: BoolNotContext) => {
    const expressionToNegate: Properties<boolean | number> = this.visit(
      ctx.children?.[1]!
    );
    if (!expressionToNegate.canBeNegated) {
      const message = ErrorsTable.quotedErrorFormat(
        "Expression {} can't be negated",
        ctx.text
      );
      this.errors.addError({
        message,
        line: ctx.start?.line ?? 0,
        column: {
          start: ctx.start?.charPositionInLine ?? 0,
          end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
        },
      });
    }
    return this.next(ctx);
  };
  visitParentheses = (ctx: ParenthesesContext) => {
    return this.next(ctx);
  };
  visitId = (ctx: IdContext) => {
    // Find it in the scope
    const name = ctx.text;
    const currentScope = this.getCurrentClass()!;
    const foundSymbol = currentScope.find(name);
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.stop?.charPositionInLine ?? 0,
    };
    if (foundSymbol) {
      return foundSymbol.getCaster();
    }
    const message = ErrorsTable.quotedErrorFormat(
      "Symbol {} not found in scope",
      name
    );
    this.errors.addError({ message, line, column });
    return this.next(ctx);
  };
  visitInt = (ctx: IntContext): Properties<number> => {
    const canBeComparedTo = [...this.findTable("Int")!.canBeComparedTo];
    const currentNumber = Number(ctx.INT());
    const canBeResolvedToBoolean = [0, 1].includes(currentNumber);
    const comparisonAndEquatedTo = canBeResolvedToBoolean ? canBeComparedTo : ["Int"]
    const type = ["Int"];
    if (canBeResolvedToBoolean) {
      type.push("Bool");
    }
    return new Properties<number>({ type })
      .allowCompared(comparisonAndEquatedTo)
      .allowInteger(currentNumber)
      .allowCompiledTime(currentNumber)
      .allowEquated(comparisonAndEquatedTo)
      .allowNegated();
  };

  visitString = (ctx: StringContext) => {
    const previousClass = this.findTable("String")!;
    // Strings can only be compared to other strings
    const expr = new Properties<string>({ type: ["String"] });
    const contents = ctx.STRING().text;
    expr
      .allowEquated(previousClass.canBeComparedTo)
      .allowString(contents);
    return expr;
  };
  visitTrue = (_ctx: TrueContext): Properties<boolean> => {
    return new Properties<boolean>({ type: ["Bool", "Int"] })
      .allowBoolean(true)
      .allowInteger(1)
      .allowNegated();
  };
  visitFalse = (_ctx: FalseContext) => {
    return new Properties<boolean>({ type: ["Bool", "Int"] })
      .allowBoolean(true)
      .allowInteger(1)
      .allowNegated();
  };
  visitAssignment = (ctx: AssignmentContext) => {
    return this.next(ctx);
  };
  visitMethod = (ctx: MethodContext) => {
    return this.next(ctx);
  };
  visitProperty = (ctx: PropertyContext) => {
    const variable = new PropertyContextHelper(ctx).getInfo();
    // Previous table
    const previousClass = this.findTable(variable.type);
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
    };
    if (!previousClass) {
      const message = ErrorsTable.quotedErrorFormat(
        "Type {} not found in scope",
        variable.type
      );
      this.errors.addError({message,line, column});
      return this.next(ctx);
    }

    const expression = ctx.expression();
    let assignationInformation = new Properties<any>({ type: [variable.type] })
    .allowCompared(previousClass!.canBeComparedTo);
    if (expression) {
      assignationInformation = this.visit(expression);

      if (!assignationInformation.) {
        const message = ErrorsTable.quotedErrorFormat(
          "Expression {} is not being resolved into a boolean expression",
          variable.name
        );
        this.errors.addError({ message, line, column });
      }
    }
    const currentScopeTable = this.getCurrentClass();

    // const previousDeclared = currentScopeTable?.find(variableName);
    const newTableElement = new SymbolElement()
      .setColumn(variable.column)
      .setLine(variable.line)
      .setName(variable.name)
      .setType(variable.type)
      .setScope(currentScopeTable?.tableName ?? "Global")
      .setCaster(
        assignationInformation ?? new Properties({ type: variable.type })
      );

    // If the current scope does not exist, the property is declared outside of a class, which is not allowed
    if (!currentScopeTable) {
      const message = ErrorsTable.quotedErrorFormat(
        "Property {} declared outside of a class",
        variable.name
      );
      this.errors.addError({
        message,
        line: variable.line,
        column: variable.column,
      });
      return this.next(ctx);
    }

    const previousDeclared = currentScopeTable.find(variable.name);
    // Case 1: Overriding (It does nothing)
    if (previousDeclared) {
      // Case 1.1: Redefinition in the same scope (error)
      if (previousDeclared.getScope() === newTableElement.getScope()) {
        // Case 1.1.1: Redefinition of two properties
        if (
          previousDeclared.getDataStructureType() ===
          newTableElement.getDataStructureType()
        ) {
          const message = ErrorsTable.quotedErrorFormat(
            "Property {} already declared",
            variable.name
          );
          this.errors.addError({
            message,
            line: variable.line,
            column: variable.column,
          });
        }
        // Case 1.1.2: Definition of a property or method with the same name as another one
        else {
          const message = ErrorsTable.quotedErrorFormat(
            "Property {} and method {} have the same name",
            variable.name,
            variable.name
          );
          this.errors.addError({
            message,
            line: variable.line,
            column: variable.column,
          });
        }
      }
      // Case 1.2: Redefinition in a parent scope (OK)
      // Case 1.2.1: Wrongful redefinition of a property (different type)
      else if (previousDeclared.getType() !== newTableElement.getType()) {
        const message = ErrorsTable.quotedErrorFormat(
          "Property {} of type {} was already declared with a different type {} inside the scope {} (NOT PERMISSIVE)",
          variable.name,
          newTableElement.getType(),
          previousDeclared.getType(),
          previousDeclared.getScope()
        );
        this.errors.addError({
          message,
          line: variable.line,
          column: variable.column,
        });
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
