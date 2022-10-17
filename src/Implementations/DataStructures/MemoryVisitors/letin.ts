import { v4 as uuid } from 'uuid';
import { LetInContext } from '../antlr/yaplParser';
import TableComponent from '../Components'
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { SymbolElement } from '../TableElements/index';
import { LinkedJump } from './Instructions/Jumps';
import { Move } from './Instructions/MemoryManagement';
import { MethodDeclaration, Return } from './Instructions/Misc';
import { TemporalValue, V0 } from './TemporaryValues';
export default function (visitor: MemoryVisitor, ctx: LetInContext): IMemoryVisitor[] {
  const assigmentExpressions = ctx.assignmentExpr();
  const expression = ctx.expression();
  const containingTable = new TableComponent<SymbolElement>();
  // @ts-ignore
  visitor.classStack.push(containingTable);
  const sizes = [];
  for (const assignmentExpr of assigmentExpressions) {
    const [result] = visitor.visit(assignmentExpr);
    sizes.push({ size: result.size });
  }
  const allSizeNeeded = sizes.reduce((a, b) => a + b.size, 0);
  visitor.startCall();
  const letInScope = 'letIn::' + uuid().substring(0, 8);
  visitor.addQuadruple(new LinkedJump(letInScope));
  visitor.endCall();

  visitor.pushScope(letInScope);
  visitor.addQuadruple(new MethodDeclaration(letInScope));
  visitor.AskForStackMemory(allSizeNeeded);
  const receivingTemporal = new TemporalValue();
  let currentStackPointer = visitor.stackMemoryOffset;
  for (const variable of containingTable.getAll()) {
    variable.setMemoryAddress(currentStackPointer);
    currentStackPointer += variable.getSize();
  }
  const [result] = visitor.visit(expression);
  const temporalResult = result.getTemporal();
  visitor.addQuadruple(
    new Move({
      dataMovesFrom: temporalResult,
      dataMovesInto: new V0(),
    }),
    new Return(),
  );

  visitor.popScope();

  visitor.classStack.pop();
  visitor.addQuadruple(
    new Move({
      dataMovesFrom: new V0(),
      dataMovesInto: receivingTemporal,
    }),
  );
  return [{ size: 1, getTemporal: () => receivingTemporal }];
}
