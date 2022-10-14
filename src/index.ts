import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { yaplLexer } from './antlr/yaplLexer';
import { yaplParser } from './antlr/yaplParser';
import path from 'path';
import fs from 'fs';
import { YaplVisitor } from './yaplVisitor';
import { extractTableComponent } from './Implementations/Components/Table';
import { MemoryVisitor } from './Implementations/DataStructures/Memory';

async function main(input: string) {
  // ScreenListener.emit(lineActions.clear);
  // ScreenListener.emit(lineActions.update, 'Initializing...');
  // ScreenListener.emit(lineActions.add, 'Starting YAPL compiler...');

  let inputStream = new ANTLRInputStream(input);
  let lexer = new yaplLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer);
  let parser = new yaplParser(tokenStream);

  let tree = parser.program();

  const visitor = new YaplVisitor();
  // Semantic
  visitor.visit(tree);
  const symbolsTable = visitor.symbolsTable;
  const errors = visitor.errorComponent().getAll();
  if (errors.length) {
    console.log('Errors found, aborting');
    return;
  }
  // Memory
  const mainClass = symbolsTable.get('Main')!;
  if (!mainClass) {
    console.log('Main method not found, aborting');
    return;
  }
  const mainTable = extractTableComponent(mainClass)!;
  const mainMethod = mainTable.get('main')!;
  if (!mainMethod) {
    console.log('Main method not found, aborting');
    return;
  }

  const memory = new MemoryVisitor(symbolsTable, visitor.mainBranch!);
  memory.instantiate();

  // console.log(memory.quadruples.join('\n'));
  // const allSizeTableValues: any[] = [];
  // for (const foundSymbol of symbolsTable) {
  //   const str = foundSymbol?.toString();
  //   if (!str) continue;
  //   console.log(str);
  // }
  // console.table(allSizeTableValues, ['Table Name', 'Size in Bytes', 'Line', 'Column', 'Inherits From']);
  // console.table(errors);
  // console.log('-----------------------END Errors-----------------------\n\n');
  return;
}

const pathToFileURL = path.join(__dirname, '..', 'example.txt');
const contents = fs.readFileSync(pathToFileURL, 'utf8');

main(contents);
