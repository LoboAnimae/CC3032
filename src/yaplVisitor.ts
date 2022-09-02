import { yaplVisitor } from "./antlr/yaplVisitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ClassDefineContext } from "./antlr/yaplParser";
import { Stack } from "./DataStructures/Stack";
import { ErrorsTable, Table } from "./DataStructures/Table";

export class YaplVisitor extends AbstractParseTreeVisitor<number> implements yaplVisitor<number> {
  private symbolsTableStack: Stack<Table>;
  private everySymbolTable: Table[];
  private currentScope: number = 0;
  private errors: ErrorsTable;
  constructor() {
    super();
    this.symbolsTableStack = new Stack<Table>();
    this.everySymbolTable = [];
    this.errors = new ErrorsTable();

    const ObjectTable = new Table({ scope: "Object", line: 0, column: { start: 0, end: 0 } });
    this.symbolsTableStack.push(ObjectTable);
  }
  protected defaultResult(): number {
    return 0;
  }

  protected aggregateResult(aggregate: number, nextResult: number): number {
    return aggregate + nextResult;
  }

  protected findTable(name: string): Table | undefined {
    return this.everySymbolTable.find((table: Table) => table.scope === name);
  }
  visitClassDefine = (ctx: ClassDefineContext): number => {
    // // If the scope is not global, then pop the current scope and push a new one.
    // if (this.currentScope !== 0) {
    //   this.symbolsTableStack.pop();
    // }
    // this.currentScope = 1;
    // const className = ctx.TYPE().toString();
    // // Every class inherits from somewhere else or object
    // const symbolToFind = ctx.INHERITS()?.toString() || "Object";
    // const lookIn = this.symbolsTableStack.peek();

    // const inheritsFrom = lookIn.find(symbolToFind);

    // const [symbl] = ctx.TYPE();
    // const start = symbl.symbol.startIndex;
    // const end = symbl.symbol.stopIndex;

    // const name = className;
    // const type = "class";
    // const line = symbl.symbol.line;
    // const column = { start, end };

    // // Create a new scope by pushing a table onto the stack
    // const currentTable: Table = new Table({
    //   scope: className,
    //   parentTable: this.symbolsTableStack.peek(),
    // });
    // this.symbolsTableStack.push(currentTable);
    // this.everySymbolTable.push(currentTable);

    // const newSymbol: SymbolElement = { name, type, column, line };

    // Case 1: Simple class
    // Case 2: Class inherits from another class

    // Case 3: Class inherits from a non-allowed class
    const className = ctx.TYPE()[0].toString();
    const inheritsFrom = ctx.TYPE().at(1)?.toString() || "Object";

    const notAllowed = ["string", "int", "bool", "void", "Object"];
    const [symbl] = ctx.TYPE();

    const start = symbl.symbol.startIndex;
    const end = symbl.symbol.stopIndex;
    const line = symbl.symbol.line;
    const column = { start, end };

    if (notAllowed.includes(className.toLowerCase())) {
      this.errors.addError({
        message: `Class ${className} can't be called this, as it overrides an existing type.`,
        line,
        column,
      });
      return 0;
    }
    if (notAllowed.includes(inheritsFrom.toLowerCase())) {
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
      parentTable: parentTable,
      line,
      column,
    });

    this.symbolsTableStack.push(currentTable);
    this.everySymbolTable.push(currentTable);

    return 0;
  };
}
