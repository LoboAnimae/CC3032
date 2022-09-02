import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { yaplLexer } from "./antlr/yaplLexer";
import { yaplParser } from "./antlr/yaplParser";
import path from "path";
import fs from "fs";
import { YaplVisitor } from "./yaplVisitor";

async function main(input: string) {
  let inputStream = new ANTLRInputStream(input);
  let lexer = new yaplLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer);
  let parser = new yaplParser(tokenStream);

  let tree = parser.program();

  const visitor = new YaplVisitor();
  const result = visitor.visit(tree);
}

const pathToFileURL = path.join(__dirname, "..", "example.txt");
const contents = fs.readFileSync(pathToFileURL, "utf8");

main(contents);
