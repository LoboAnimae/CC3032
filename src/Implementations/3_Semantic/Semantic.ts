import { ClassDefineContext, ProgramContext } from 'antlr/yaplParser';
import { TableComponent } from 'Components/Table';
import { TypeComponent } from 'Components/Type';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { IError } from 'Implementations/Misc/Error';

export interface ISemanticResult {
  symbolsTable?: TableComponent<TypeComponent>;
  errors?: IError[];
  mainBranch?: ClassDefineContext;
}

export default function Semantic(programRoot: ProgramContext): ISemanticResult {
  const visitor = new YaplVisitor();
  visitor.visit(programRoot);
  const errors = visitor.errorComponent().getAll();
  if (errors.length) {
    return { errors };
  }
  const symbolsTable = visitor.symbolsTable;
  return { symbolsTable, mainBranch: visitor.mainBranch };
}
