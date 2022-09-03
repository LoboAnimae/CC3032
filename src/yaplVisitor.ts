import { yaplVisitor } from "./antlr/yaplVisitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { AddContext, AssignmentContext, BlockContext, BoolNotContext, ClassDefineContext, ClassesContext, DivisionContext, EofContext, EqualContext, ExpressionContext, FalseContext, FeatureContext, FormalContext, IdContext, IfContext, IntContext, IsvoidContext, LessEqualContext, LessThanContext, LetInContext, MethodCallContext, MethodContext, MinusContext, MultiplyContext, NegativeContext, NewContext, OwnMethodCallContext, ParenthesesContext, ProgramBlocksContext, ProgramContext, PropertyContext, StringContext, TrueContext, WhileContext } from "./antlr/yaplParser";
import { Stack } from "./DataStructures/Stack";
import { ErrorsTable, MethodElement, Table, TableElement } from "./DataStructures/Table";

enum Scope {
  Global = 1,
  General,
}



export class YaplVisitor extends AbstractParseTreeVisitor<number> implements yaplVisitor<number> {
  private scopeStack: Stack<Table>;
  private symbolsTable: Table[];
  private genericsTable: Table[] = [];
  private mainExists: boolean = false;
  private mainMethodExists: boolean = false;
  public errors: ErrorsTable;
  constructor() {
    super();
    this.scopeStack = new Stack<Table>(); // Scopes are implemented as a stack.
    this.symbolsTable = []; // Symbols are universal
    this.errors = new ErrorsTable();

    //#region Int
    // Int doesn't depend on any other class, so it's added first to the stack
    const IntTable = new Table({ scope: "Int", isGeneric: true });
    //#endregion
    //#region Bool
    // Bool doesn't depend on any other class, so it's added to the stack with Int
    const BoolTable = new Table({ scope: "Bool", isGeneric: true });
    //#endregion
    //#region String
    // String depends on Int, so it's added second to the stack
    const StringTable = new Table({ scope: "String", isGeneric: true });
    const lengthMethod = new MethodElement()
      .setName("length")
      .setReturnType("Int");

    const concatMethod = new MethodElement()
      .setName("concat")
      .setReturnType("String")
      .addParameter({ name: 's', type: 'String' });

    const substrMethod = new MethodElement()
      .setName("substr")
      .setReturnType("String")
      .addParameter({ name: 'i', type: 'Int' })
      .addParameter({ name: 'l', type: 'Int' });

    StringTable.symbols.push(lengthMethod, concatMethod, substrMethod);
    //#endregion

    //#region IO
    // IO depends on String and Int, so it's added third to the stack
    const IOTable = new Table({ scope: "IO", isGeneric: true });

    const outStringMethod = new MethodElement()
      .setName('out_string')
      .setReturnType('IO')
      .addParameter({ name: 'x', type: 'String' });

    const outIntMethod = new MethodElement()
      .setName("out_int")
      .setReturnType("IO")
      .addParameter({ name: 'x', type: 'Int' });

    const inStringMethod = new MethodElement()
      .setName("in_string")
      .setReturnType("String");

    const inIntMethod = new MethodElement()
      .setName("in_int")
      .setReturnType("Int");

    IOTable.addElement(outStringMethod, outIntMethod, inStringMethod, inIntMethod);
    //#endregion
    //#region Object
    // Object depends on String, so it's added last
    const ObjectTable = new Table({ scope: "Object" });

    const abortMethod = new MethodElement()
      .setReturnType("Object")
      .setName("abort");

    const typeNameMethod = new MethodElement()
      .setReturnType("String")
      .setName("type_name");

    const copyMethod = new MethodElement()
      .setReturnType("Object")
      .setName("copy");

    ObjectTable.addElement(abortMethod, typeNameMethod, copyMethod);
    //#endregion
    this.scopeStack.push(ObjectTable);
    this.symbolsTable.push(IntTable, BoolTable, StringTable, IOTable, ObjectTable);
  }
  defaultResult(): number {
    return 0;
  }

  aggregateResult(aggregate: number, nextResult: number): number {
    return aggregate + nextResult;
  }

  protected findTable(name: string): Table | undefined {
    return this.symbolsTable.find((table: Table) => table.scope === name);
  }

  protected returnToScope(scope: Scope) {
    while (this.scopeStack.size() > scope) {
      this.scopeStack.pop();
    }
  }

  private returnToGlobalScope() {
    this.returnToScope(Scope.Global);
  }

  // The second scope in the stack is always a class
  private getCurrentClass(): Table {
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
        message: ErrorsTable.quotedErrorFormat("{} Class {} can't inherit from itself", "Recursive Inheritance:", className),
        line,
        column
      });
      return 1 + super.visitChildren(ctx);
    }

    // If the table was previously defined, then it means there is another class with the same name
    if (classTable) {
      const message = classTable.isGeneric ?
        ErrorsTable.quotedErrorFormat('Can\'t redefine generic class {}', className) :
        ErrorsTable.quotedErrorFormat('Redefinition of class {}', className);
      this.errors.addError({ message, line, column });
      return 1 + super.visitChildren(ctx);
    }

    const parentTable = this.findTable(inheritsFrom);
    const newTable = new Table({ scope: className, parentTable, line, column });

    // If the parent table doesn't exist, then it means that the class inherits from a non-existing class
    if (!parentTable) {
      const message = ErrorsTable.quotedErrorFormat(`{} attempted to inherit from class {}, but it does not exist.`, className, inheritsFrom);
      this.errors.addError({ message, line, column });
    }
    // If the parent table is not allowed to be inherited, then it means that the class inherits from a non-allowed class
    else if (!parentTable.canBeInherited) {
      const message = parentTable.isGeneric ?
        ErrorsTable.quotedErrorFormat(`Class {} can't inherit from generic class {}`, className, inheritsFrom) :
        ErrorsTable.quotedErrorFormat(`Class {} can't inherit from class {}`, className, inheritsFrom);
      this.errors.addError({ message, line, column });
    }

    // If main exists and this class is Main, then it means that there are two main classes
    if (className === "Main" && this.mainExists) {
      const message = ErrorsTable.quotedErrorFormat('Redefinition of class {}', "Main");
      this.errors.addError({ message, line, column });
      return 1 + super.visitChildren(ctx);
    }
    this.mainExists = this.mainExists || className === "Main";


    // Class "Main" must inherit from "Object"
    if (newTable.tableName === "Main" && parentTable?.tableName !== "Object") {
      this.errors.addError({
        message: ErrorsTable.errorFormat(`{} class must not inherit from anywhere.`, "Main"),
        line,
        column,
      });
      return 1 + super.visitChildren(ctx);
    }


    // Push the table to the stack and the table to the list of tables
    this.symbolsTable.push(newTable);
    this.scopeStack.push(newTable);
    return 1 + super.visitChildren(ctx);
  };

  visitMethodCall = (ctx: MethodCallContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitOwnMethodCall = (ctx: OwnMethodCallContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitIf = (ctx: IfContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitWhile = (ctx: WhileContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitBlock = (ctx: BlockContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitLetIn = (ctx: LetInContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitNew = (ctx: NewContext) => {
    const instantiationOf = ctx.TYPE().toString();
    // Find a table with the same name as the type of the instantiation
    const table = this.findTable(instantiationOf);
    const parentName = this.getCurrentClass()?.tableName;
    const { symbol } = ctx.TYPE();
    const start = symbol.startIndex;
    const end = symbol.stopIndex;
    const line = symbol.line;
    const column = { start, end };
    if (!table) {
      const message = ErrorsTable.quotedErrorFormat('Instantiation of class {}, which not exist (yet?)', instantiationOf);
      this.errors.addError({ message, line, column });
    } else if (table.tableName === parentName) {
      const message = ErrorsTable.quotedErrorFormat('Instantiation of class {} inside itself', instantiationOf);
      this.errors.addError({ message, line, column });
    }


    return 1 + super.visitChildren(ctx);
  };
  visitNegative = (ctx: NegativeContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitIsvoid = (ctx: IsvoidContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitMultiply = (ctx: MultiplyContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitDivision = (ctx: DivisionContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitAdd = (ctx: AddContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitMinus = (ctx: MinusContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitLessThan = (ctx: LessThanContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitLessEqual = (ctx: LessEqualContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitEqual = (ctx: EqualContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitBoolNot = (ctx: BoolNotContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitParentheses = (ctx: ParenthesesContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitId = (ctx: IdContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitInt = (ctx: IntContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitString = (ctx: StringContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitTrue = (ctx: TrueContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitFalse = (ctx: FalseContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitAssignment = (ctx: AssignmentContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitMethod = (ctx: MethodContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitProperty = (ctx: PropertyContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitClasses = (ctx: ClassesContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitEof = (ctx: EofContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitProgram = (ctx: ProgramContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitProgramBlocks = (ctx: ProgramBlocksContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitFeature = (ctx: FeatureContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitFormal = (ctx: FormalContext) => {
    return 1 + super.visitChildren(ctx);
  };
  visitExpression = (ctx: ExpressionContext) => {
    return 1 + super.visitChildren(ctx);
  };
}
