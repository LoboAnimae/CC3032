import { WhileContext } from '../../../antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { v4 as uuid } from 'uuid';
import { MethodDeclaration } from './Instructions/Misc';
import { EQUAL } from './Instructions/Comparison';
import { TemporalValue } from './TemporaryValues';
export default function (visitor: MemoryVisitor, ctx: WhileContext): IMemoryVisitor[] {
  const [condition, body] = ctx.expression();

  const whileCondition = 'while::' + uuid().substring(0, 8);
  const endWhile = whileCondition + 'end';
  const whileGuard = new EQUAL({
    fistOperand: new TemporalValue(),
    secondOperand: new TemporalValue(),
    goTo: endWhile,
  });
  visitor.addQuadruple(whileGuard);
  visitor.addQuadruple(new MethodDeclaration(whileCondition));
  visitor.visit(body);
  visitor.visit(condition);
  const lastQuadruple = visitor.methods[visitor.scopes.at(-1)!].at(-1);
  lastQuadruple!.dest = whileCondition;
  whileGuard.src1 = lastQuadruple!.src2;
  whileGuard.src2 = lastQuadruple!.src1;
  whileGuard.operator = lastQuadruple!.operator;
  whileGuard.operatorVerbose = lastQuadruple!.operatorVerbose;

  visitor.addQuadruple(new MethodDeclaration(endWhile));

  return [];
}
