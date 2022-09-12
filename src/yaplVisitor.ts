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
    //#region Int
    // Int doesn't depend on any other class, so it's added first to the stack
    const IntType = new Table<number>({
      errors: this.errors,
      warnings: this.warnings,
      scope: "Int",
      isGeneric: true,
      canBeComparedTo: ["Bool"],
      defaultValue: 0,
      assigmentFunction: () =>
        function (input: any) {
          if (typeof input === "number") {
            return [true];
          } else if (typeof input === "boolean") {
            const message = ErrorsTable.quotedErrorFormat(
              "Implicit conversion from {} to {}",
              "Bool",
              "Int"
            );
            return [true, message];
          } else if (input instanceof Table) {
            // @ts-ignore
            if (input.tableName === "Int") return this.allowsAssignmentOf(1);
            if (input.tableName === "Bool")
              // @ts-ignore
              return this.allowsAssignmentOf(true);
          }
          return [false];
        },
      comparisonFunction: () =>
        function (against: any) {
          if (typeof against === "number") {
            return [true];
          } else if (typeof against === "boolean") {
            return [
              true,
              ErrorsTable.quotedErrorFormat(
                "Implicit conversion from {} to {}",
                "Boolean",
                "Int"
              ),
            ];
          } else if (against instanceof Table) {
            // @ts-ignore
            if (against.tableName === "Int") return this.allowsComparisonsTo(1);
            if (against.tableName === "Bool")
              // @ts-ignore
              return this.allowsComparisonsTo(true);
          }
          return [false];
        },
    });
    //#endregion
    //#region Bool
    // Bool doesn't depend on any other class, so it's added to the stack with Int
    const BoolType = new Table<boolean>({
      errors: this.errors,
      warnings: this.warnings,
      scope: "Bool",
      isGeneric: true,
      canBeComparedTo: ["Int"],
      defaultValue: false,
      assigmentFunction: () =>
        function (input: any) {
          switch (typeof input) {
            case "boolean":
              return [true];
            case "number":
              if ([0, 1].includes(input)) {
                return [
                  true,
                  ErrorsTable.quotedErrorFormat(
                    "Implicit conversion from {} to {}",
                    "Int",
                    "Bool"
                  ),
                ];
              }
              return [false];
          }
          if (input instanceof Table) {
            // @ts-ignore
            if (input.tableName === "Int") return this.allowsAssignmentOf(1);
            if (input.tableName === "Bool")
              // @ts-ignore
              return this.allowsAssignmentOf(true);
          }
          return [false];
        },
      comparisonFunction: () =>
        function (against: any) {
          if (typeof against === "boolean") {
            return [true];
          } else if (typeof against === "number") {
            return [
              true,
              ErrorsTable.quotedErrorFormat(
                "Implicit conversion from {} to {}",
                "Int",
                "Bool"
              ),
            ];
          } else if (against instanceof Table) {
            // @ts-ignore
            if (against.tableName === "Int") return this.allowsComparisonsTo(1);
            if (against.tableName === "Bool")
              // @ts-ignore
              return this.allowsComparisonsTo(true);
          }
          return [false];
        },
    });
    //#endregion
    //#region String
    // String depends on Int, so it's added second to the stack
    const StringType = new Table<string>({
      scope: "String",
      isGeneric: true,
      defaultValue: "",
      assigmentFunction: () =>
        function (input: any) {
          if (typeof input === "string") return [true];
          if (input instanceof Table) {
            if (["String"].includes(input.tableName)) return [true];
          }
          return [false];
        },
      comparisonFunction: () => () => [false],
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
    const ObjectType = new Table<{}>({
      scope: "Object",
      defaultValue: {},
      assigmentFunction: () => (input: any) => {
        if (input instanceof Table) {
          // @ts-ignore
          return [this.tableName === input.tableName];
        }
        return [false];
      },
      comparisonFunction: () => () => [false],
    });

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
    this.returnToGlobalScope(); // Return to the global scope, since classes can only be defined in the global scope.
    // Case 1: Simple class
    // Case 2: Class inherits from another class
    // Case 3: Class inherits from a non-allowed class
    // const className = ctx.TYPE()[0].toString();
    const [cls, inheritsFrom = "Object"] = ctx.TYPE();
    // Check if the class already exists
    const classTable = this.findTable(cls);

    const start = cls.symbol.startIndex;
    const end = cls.symbol.stopIndex;
    const line = cls.symbol.line;
    const column = { start, end };

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
    if (cls == inheritsFrom) {
      this.errors.addError({
        message: ErrorsTable.quotedErrorFormat(
          "{} Class {} can't inherit from itself",
          "Recursive Inheritance:",
          cls.text
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
            cls.text
          )
        : ErrorsTable.quotedErrorFormat("Redefinition of class {}", cls.text);
      this.errors.addError({ message, line, column });
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

    // If the parent table doesn't exist, then it means that the class inherits from a non-existing class
    if (!parentTable) {
      const message = ErrorsTable.quotedErrorFormat(
        `{} attempted to inherit from class {}, but it does not exist.`,
        cls.text,
        inheritsFrom
      );
      this.errors.addError({ message, line, column });
    }
    // If the parent table is not allowed to be inherited, then it means that the class inherits from a non-allowed class
    else if (!parentTable.canBeInherited) {
      const message = parentTable.isGeneric
        ? ErrorsTable.quotedErrorFormat(
            `Class {} can't inherit from generic class {}`,
            cls.text,
            inheritsFrom
          )
        : ErrorsTable.quotedErrorFormat(
            `Class {} can't inherit from class {}`,
            cls.text,
            inheritsFrom
          );
      this.errors.addError({ message, line, column });
    }

    if (newTable.tableName === "Main") {
      if (this.mainExists) {
        const message = ErrorsTable.quotedErrorFormat(
          "Redefinition of class {}",
          "Main"
        );
        this.errors.addError({ message, line, column });
        return this.next(ctx);
      }

      this.mainExists = this.mainExists || cls.text === "Main";
      if (parentTable?.tableName !== "Object") {
        this.errors.addError({
          message: ErrorsTable.errorFormat(
            `{} class must not inherit from anywhere.`,
            "Main"
          ),
          line,
          column,
        });
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
    if (!expressionToCast) {
    }
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
    // const leftExpression: Properties<number> = this.visit(ctx.children?.[0]!);
    // const visitRightExpression: Properties<number> = this.visit(
    //   ctx.children?.[2]!
    // );
    // const expr = new Properties<number>({ type: "Int" });
    // const line = ctx.start?.line ?? 0;
    // const column = {
    //   start: ctx.start?.charPositionInLine ?? 0,
    //   end: ctx.stop?.charPositionInLine ?? 0,
    // };

    // if (!(leftExpression.canBeInteger && visitRightExpression.canBeInteger)) {
    //   let message = "";
    //   const leftIsInteger = leftExpression.canBeInteger;
    //   const rightIsInteger = visitRightExpression.canBeInteger;

    //   if (!leftIsInteger && !rightIsInteger) {
    //     message = ErrorsTable.quotedErrorFormat(
    //       "Both operands of '+' must be integers ({} and {} are not integers, and can't be casted)",
    //       ctx.children?.[0]!.text,
    //       ctx.children?.[2]!.text
    //     );
    //   } else if (!leftIsInteger) {
    //     message = ErrorsTable.quotedErrorFormat(
    //       "Left operand of '+' must be an integer ({} is not an integer and can't be casted)",
    //       ctx.children?.[0]!.text
    //     );
    //   } else if (!rightIsInteger) {
    //     message = ErrorsTable.quotedErrorFormat(
    //       "Right operand of '+' must be an integer ({} is not an integer and can't be casted)",
    //       ctx.children?.[2]!.text
    //     );
    //   } else {
    //     message = ErrorsTable.quotedErrorFormat(
    //       "Unknown error while evaluating expression {}",
    //       ctx.text
    //     );
    //   }
    //   this.errors.addError({ message, line, column });
    // }

    // return expr;
    return this.next(ctx);
  };
  visitMinus = (ctx: MinusContext) => {
    return this.next(ctx);
  };

  // Less thans return booleans
  visitLessThan = (ctx: LessThanContext) => {
    const leftExpr: Table<number> = this.visit(ctx.children?.[0]!);
    const rightExpr: Table<number> = this.visit(ctx.children?.[2]!);
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.stop?.charPositionInLine ?? 0,
    };
    const [allowsComparison, warning] = leftExpr.allowsComparisonsTo(rightExpr);
    if (warning) {
      this.warnings.addError({ message: warning, line, column });
    }
    if (!allowsComparison) {
      const message = ErrorsTable.quotedErrorFormat(
        "Can't compare {} with {} in expression ({})",
        leftExpr.tableName,
        rightExpr.tableName,
        "  " + ctx.text + "  "
      );
      this.errors.addError({ message, line, column });
    }

    if (warning) {
      this.warnings.addError({ message: warning, line, column });
    }
    return this.findTable("Bool")!;
  };
  visitLessEqual = (ctx: LessEqualContext) => {
    const leftExpr: Table<number> = this.visit(ctx.children?.[0]!);
    const rightExpr: Table<number> = this.visit(ctx.children?.[2]!);
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.stop?.charPositionInLine ?? 0,
    };
    const [allowsComparison, warning] = leftExpr.allowsComparisonsTo(rightExpr);
    if (warning) {
      this.warnings.addError({ message: warning, line, column });
    }
    if (!allowsComparison) {
      const message = ErrorsTable.quotedErrorFormat(
        "Can't compare {} with {} in expression ({})",
        leftExpr.tableName,
        rightExpr.tableName,
        "  " + ctx.text + "  "
      );
      this.errors.addError({ message, line, column });
    }
    return this.findTable("Bool")!;
  };
  visitEqual = (ctx: EqualContext) => {
    return this.next(ctx);
  };
  visitBoolNot = (ctx: BoolNotContext) => {
    return this.next(ctx);
  };
  visitParentheses = (ctx: ParenthesesContext) => {
    return this.next(ctx);
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
    if (!foundSymbol) {
      const message = ErrorsTable.quotedErrorFormat(
        "Symbol {} not found in scope",
        name
      );
      this.errors.addError({ message, line, column });
    }
    return this.findTable(foundSymbol?.getType()!);
  };
  visitInt = (ctx: IntContext): Table<number> => {
    return this.findTable("Int")!;
  };

  visitString = (ctx: StringContext): Table<string> => {
    return this.findTable("String")!;
  };
  visitTrue = (_ctx: TrueContext): Table<boolean> => {
    return this.findTable("Bool")!;
  };
  visitFalse = (_ctx: FalseContext): Table<boolean> => {
    return this.findTable("Bool")!;
  };
  visitAssignment = (ctx: AssignmentContext) => {
    return this.next(ctx);
  };
  visitMethod = (ctx: MethodContext) => {
    return this.next(ctx);
  };
  visitProperty = (ctx: PropertyContext) => {
    // Previous table
    const [name, _, dataType, __, assignmentExpression] = ctx.children!;

    const previousClass = this.findTable(dataType);
    const line = ctx.start?.line ?? 0;
    const column = {
      start: ctx.start?.charPositionInLine ?? 0,
      end: ctx.start?.charPositionInLine ?? 0 + ctx.text.length,
    };
    if (!previousClass) {
      const message = ErrorsTable.quotedErrorFormat(
        "Type {} not found in scope",
        dataType.text
      );
      this.errors.addError({ message, line, column });
      return this.next(ctx);
    }

    if (assignmentExpression) {
      const resolvesTo: Table<any> = this.visit(assignmentExpression);
      const [allowedAssigment, warning] =
        previousClass.allowsAssignmentOf(resolvesTo);
      if (warning) {
        this.warnings.addError({ message: warning, line, column });
      }
      if (!allowedAssigment) {
        const message = ErrorsTable.quotedErrorFormat(
          "Expression {} can't be assigned to {} (Assigning {} to {})",
          assignmentExpression.text,
          dataType.text,
          resolvesTo.tableName,
          previousClass.tableName
        );
        this.errors.addError({ message, line, column });
      }
    }
    // let assignationInformation = new Properties<any>({ type: [variable.type] })
    // .allowCompared(previousClass!.canBeComparedTo);
    // if (expression) {
    //   assignationInformation = this.visit(expression);

    //   if (!assignationInformation.) {
    //     const message = ErrorsTable.quotedErrorFormat(
    //       "Expression {} is not being resolved into a boolean expression",
    //       variable.name
    //     );
    //     this.errors.addError({ message, line, column });
    //   }
    // }
    const currentScopeTable = this.getCurrentClass();

    // const previousDeclared = currentScopeTable?.find(variableName);
    const newTableElement = new SymbolElement()
      .setColumn(column)
      .setLine(line)
      .setName(name.text)
      .setType(dataType.text)
      .setScope(currentScopeTable?.tableName ?? "Global");

    // If the current scope does not exist, the property is declared outside of a class, which is not allowed
    if (!currentScopeTable) {
      const message = ErrorsTable.quotedErrorFormat(
        "Property {} declared outside of a class",
        name.text
      );
      this.errors.addError({
        message,
        line: line,
        column: column,
      });
      return this.next(ctx);
    }

    const previousDeclared = currentScopeTable.find(name.text);
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
            name
          );
          this.errors.addError({
            message,
            line: line,
            column: column,
          });
        }
        // Case 1.1.2: Definition of a property or method with the same name as another one
        else {
          const message = ErrorsTable.quotedErrorFormat(
            "Property {} and method {} have the same name",
            name,
            name
          );
          this.errors.addError({
            message,
            line: line,
            column: column,
          });
        }
      }
      // Case 1.2: Redefinition in a parent scope (OK)
      // Case 1.2.1: Wrongful redefinition of a property (different type)
      else if (previousDeclared.getType() !== newTableElement.getType()) {
        const message = ErrorsTable.quotedErrorFormat(
          "Property {} of type {} was already declared with a different type {} inside the scope {} (NOT PERMISSIVE)",
          name,
          newTableElement.getType(),
          previousDeclared.getType(),
          previousDeclared.getScope()
        );
        this.errors.addError({
          message,
          line: line,
          column: column,
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
