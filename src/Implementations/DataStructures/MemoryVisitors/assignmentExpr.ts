import { AssignmentExprContext } from '../antlr/yaplParser';
import TypeComponent, { extractTypeComponent } from '../Components'
import { ClassType } from "../../Generics/Class.type";
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { SymbolElement } from '../TableElements/index';
import { Move } from './Instructions/MemoryManagement';
import { TemporalValue } from './TemporaryValues';

export default function visitAssignmentExpr(visitor: MemoryVisitor, ctx: AssignmentExprContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const type = ctx.TYPE();
  const expression = ctx.expression();
  const typeClass = visitor.symbolsTable.get(type.text)!.copy() as ClassType;
  const currentClassTable = visitor.currentClassTable();

  const newSymbol = new SymbolElement({
    type: typeClass as ClassType,
    scopeName: 'Temporal',
    name: name.text,
  });

  const thisTemporal = new TemporalValue();
  currentClassTable.add(newSymbol);
  if (expression) {
    const [expressionVisitor] = visitor.visit(expression);
    const temporal = expressionVisitor.getTemporal();
    visitor.addQuadruple(
      new Move({
        dataMovesInto: thisTemporal,
        dataMovesFrom: temporal,
      }),
    );
  } else {
    visitor.addQuadruple(
      new Move({
        dataMovesInto: thisTemporal,
        dataMovesFrom: typeClass.defaultValue,
      }),
    );
  }
  const size = typeClass.getSize?.() ?? typeClass.sizeInBytes;
  return [{ size, getTemporal: () => thisTemporal }];
}
