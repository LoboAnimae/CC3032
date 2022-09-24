import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { yaplLexer } from "./antlr/yaplLexer";
import { yaplParser } from "./antlr/yaplParser";
import path from "path";
import fs from "fs";
import { YaplVisitor } from "./yaplVisitor";
import ScreenListener, { lineActions } from "./Misc/Screen";

async function main(input: string) {
  ScreenListener.emit(lineActions.clear);
  ScreenListener.emit(lineActions.update, "Initializing...");
  ScreenListener.emit(lineActions.add, "Starting YAPL compiler...");

  let inputStream = new ANTLRInputStream(input);
  ScreenListener.emit(lineActions.update, "Reading input...");
  let lexer = new yaplLexer(inputStream);
  ScreenListener.emit(lineActions.update, "Lexing input...");
  let tokenStream = new CommonTokenStream(lexer);
  ScreenListener.emit(lineActions.update, "Tokenizing input...");
  let parser = new yaplParser(tokenStream);
  ScreenListener.emit(lineActions.update, "Parsing input...");

  let tree = parser.program();

  const visitor = new YaplVisitor();
  const result = visitor.visit(tree);
  const symbolsTable = visitor.symbolsTable;
  const errors = visitor.errors.unwrap();

  ScreenListener.emit(lineActions.update, "Writing Symbols Table...");
  const allSizeTableValues: any[] = [];
  for (const foundSymbol of symbolsTable) {
    const str = foundSymbol?.toString();
    if (!str) continue;
    allSizeTableValues.push(foundSymbol);
  }
  ScreenListener.emit(lineActions.add, "Symbols Table");
  ScreenListener.emit(lineActions.resetLine);
  console.table(allSizeTableValues, ["Table Name", "Size in Bytes", "Line", "Column", "Inherits From"]);
  ScreenListener.emit(lineActions.add, "Errors Table");
  ScreenListener.emit(lineActions.resetLine);
  console.table(errors);
  console.log("-----------------------END Errors-----------------------\n\n");
}

const pathToFileURL = path.join(__dirname, "..", "example.txt");
const contents = fs.readFileSync(pathToFileURL, "utf8");

main(contents);
