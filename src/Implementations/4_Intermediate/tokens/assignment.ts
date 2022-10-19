import { SymbolElement } from "../..";
import { AssignmentContext } from "../../../antlr/yaplParser";
import { MemoryAddress, Move } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: AssignmentContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const currentTable = visitor.currentClassTable();
  const referencedVariable = currentTable.get(name.text)! as SymbolElement;
  const memoryValue = referencedVariable.getMemoryAddress();
  const memory = new MemoryAddress(memoryValue);
  const [expressionResult] = visitor.visit(ctx.expression());
  const temporal = expressionResult.getTemporal();
  visitor.addQuadruple(new Move({ dataMovesInto: memory, dataMovesFrom: temporal }));
  return [{ size: 0, getTemporal: () => temporal }];
}
