import { ProgramContext } from "antlr/yaplParser";
import { YaplVisitor } from "../../yaplVisitor";

export interface ISemantic {
    canContinue: boolean;
}

export interface ISemanticSuccess extends ISemantic {
    symbolsTable: any;
}

export interface ISemanticError extends ISemantic {
    errors: string[];
}

export default function Semantic(programRoot: ProgramContext): ISemanaticError | ISemanticSuccess {
    const visitor = new YaplVisitor(programRoot);
}