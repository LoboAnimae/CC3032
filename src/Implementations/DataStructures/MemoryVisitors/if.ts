import { v4 as uuid } from 'uuid';
import { IfContext } from '../antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { LinkedJump, UnconditionalJump } from './Instructions/Jumps';
import { Move } from './Instructions/MemoryManagement';
import { MethodDeclaration, Return } from './Instructions/Misc';
import { TemporalValue, V0 } from './TemporaryValues';
export default function (visitor: MemoryVisitor, ctx: IfContext): IMemoryVisitor[] {
  const [condition, body, elses] = ctx.expression();

  // Condition
  const ifCondition = 'if::' + uuid().substring(0, 8);
  // GOTO
  visitor.visit(condition);
  const lastQuadruple = visitor.methods[visitor.scopes.at(-1)!].at(-1);
  lastQuadruple!.dest = ifCondition;
  visitor.visit(elses);
  visitor.addQuadruple(new MethodDeclaration(ifCondition + 'end'));

  // BODY
  visitor.pushScope(ifCondition);
  visitor.addQuadruple(new MethodDeclaration(ifCondition));
  const [bodyReturn] = visitor.visit(body);
  visitor.addQuadruple(
    new Move({
      dataMovesInto: new V0(),
      dataMovesFrom: bodyReturn.getTemporal(),
    }),
  );
  visitor.addQuadruple(new UnconditionalJump(ifCondition + 'end'));
  visitor.addQuadruple(new Return());
  visitor.popScope();

  return [{ size: 1, getTemporal: () => new TemporalValue() }];
}
