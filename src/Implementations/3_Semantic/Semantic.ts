import { ClassDefineContext, ProgramContext } from "../../antlr/yaplParser";
import { TableComponent, TypeComponent } from "../../Components";
import { IError } from "../../Interfaces";
import { YaplVisitor } from "./visitor";


export interface ISemanticResult {
  symbolsTable?: TableComponent<TypeComponent>;
  errors?: IError[];
  mainBranch?: ClassDefineContext;
}

export function Semantic(programRoot: ProgramContext): ISemanticResult {
  const visitor = new YaplVisitor();
  visitor.visit(programRoot);
  const errors = visitor.errorComponent().getAll();
  if (errors.length) {
    return { errors };
  }
  const symbolsTable = visitor.symbolsTable;
  return { symbolsTable, mainBranch: visitor.mainBranch };
}
