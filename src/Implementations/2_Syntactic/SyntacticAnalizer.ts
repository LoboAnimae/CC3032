import { CommonTokenStream } from 'antlr4ts';
import { yaplParser } from 'antlr/yaplParser';

const getParser = (tokenStream: CommonTokenStream) => new yaplParser(tokenStream);
const getTree = (parser: yaplParser) => parser.program();

export default function Parser(tokenStream: CommonTokenStream) {
  const parser = getParser(tokenStream);
  const tree = getTree(parser);
  return { parser, tree };
}
