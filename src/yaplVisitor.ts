import { yaplVisitor } from "./antlr/yaplVisitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ClassDefineContext } from "./antlr/yaplParser";
import { Stack } from "./DataStructures/Stack";
import { ErrorsTable, Table } from "./DataStructures/Table";

enum Scope {
  Global,
  General,
}

export class YaplVisitor extends AbstractParseTreeVisitor<number> implements yaplVisitor<number> {
  private scopeStack: Stack<Table>;
  private symbolsTable: Table[];
  private currentScope: number = 0;
  private errors: ErrorsTable;
  constructor() {
    super();
    this.scopeStack = new Stack<Table>(); // Scopes are implemented as a stack.
    this.symbolsTable = []; // Symbols are universal
    this.errors = new ErrorsTable();

    const ObjectTable = new Table({ scope: "Object", line: 0, column: { start: 0, end: 0 } });
    this.scopeStack.push(ObjectTable);
    this.symbolsTable.push(ObjectTable);
  }
  protected defaultResult(): number {
    return 0;
  }

  protected aggregateResult(aggregate: number, nextResult: number): number {
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

  visitClassDefine = (ctx: ClassDefineContext): number => {
    this.returnToScope(Scope.Global); // Return to the global scope, since classes can only be defined in the global scope.
    // Case 1: Simple class
    // Case 2: Class inherits from another class
    // Case 3: Class inherits from a non-allowed class
    const className = ctx.TYPE()[0].toString();
    const inheritsFrom = ctx.TYPE().at(1)?.toString() || "Object";

    const cantInherit = ["string", "int", "bool", "void", "IO"];
    const cantOverload = [...cantInherit, "Object"];
    const [symbl] = ctx.TYPE();

    const start = symbl.symbol.startIndex;
    const end = symbl.symbol.stopIndex;
    const line = symbl.symbol.line;
    const column = { start, end };

    if (cantOverload.includes(className.toLowerCase())) {
      this.errors.addError({
        message: `Class ${className} can't be called this, as it overrides an existing type.`,
        line,
        column,
      });
      return 0;
    }
    if (cantInherit.includes(inheritsFrom.toLowerCase())) {
      this.errors.addError({
        message: `Class ${className} can't inherit from a generic type.`,
        line,
        column,
      });
      return 0;
    }
    if (className === "Main" && inheritsFrom !== "Object") {
      this.errors.addError({
        message: `Main class must not inherit from anywhere.`,
        line,
        column,
      });
      return 0;
    }

    const parentTable = this.findTable(inheritsFrom);

    // Create a new scope by pushing a table onto the stack
    const currentTable: Table = new Table({
      scope: className,
      parentTable,
      line,
      column,
    });

    this.scopeStack.push(currentTable);
    this.symbolsTable.push(currentTable);
    return 0;
  };
}
