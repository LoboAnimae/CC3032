import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { yaplLexer } from './antlr/yaplLexer';
import { yaplParser } from './antlr/yaplParser';
import path from 'path';
import fs from 'fs';
import { YaplVisitor } from './yaplVisitor';

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
  const result = visitor.visit(tree);
  const symbolsTable = visitor.symbolsTable;
  const errors = visitor.errors.getAll();

  const allSizeTableValues: any[] = [];
  for (const foundSymbol of symbolsTable) {
    const str = foundSymbol?.toString();
    if (!str) continue;
    console.log(str);
  }
  // console.table(allSizeTableValues, ['Table Name', 'Size in Bytes', 'Line', 'Column', 'Inherits From']);
  // console.table(errors);
  // console.log('-----------------------END Errors-----------------------\n\n');
}

const pathToFileURL = path.join(__dirname, '..', 'example.txt');
const contents = fs.readFileSync(pathToFileURL, 'utf8');

main(contents);
