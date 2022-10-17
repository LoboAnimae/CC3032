import { ANTLRInputStream, CharStreams, CodePointCharStream, CommonTokenStream } from "antlr4ts";
import { yaplLexer } from "../../antlr/yaplLexer";

const getInputStream = (inputString: string) => CharStreams.fromString(inputString);
const toLexer = (input: CodePointCharStream) => new yaplLexer(input);
const toCommonTokenStream = (lexer: yaplLexer) => new CommonTokenStream(lexer);


export default function Lexer(inputString: string): CommonTokenStream {
    const inputStream = getInputStream(inputString);
    const lexer = toLexer(inputStream);
    return toCommonTokenStream(lexer);
}