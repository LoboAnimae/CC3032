import { WhileContext } from "../../../antlr/yaplParser";
import { TemporalValue } from "../../../Components";
import { MethodDeclaration } from "../Instructions";
import { EQUAL } from "../Instructions/Comparison";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";
import { v4 as uuid } from 'uuid';

export default function (visitor: MemoryVisitor, ctx: WhileContext): IMemoryVisitor[] {
  const [condition, body] = ctx.expression();

  const whileCondition = 'while::' + uuid().substring(0, 8);
  const endWhile = whileCondition + 'end';
  visitor.visit(condition);
  const conditioner = visitor.methods[visitor.scopes.at(-1)!].pop()!;
  const whileGuard = new EQUAL({
    fistOperand: new TemporalValue(),
    secondOperand: new TemporalValue(),
    goTo: endWhile,
  });
  visitor.addQuadruple(whileGuard);
  visitor.addQuadruple(new MethodDeclaration(whileCondition));
  visitor.visit(body);
  visitor.addQuadruple(conditioner);
  const lastQuadruple = visitor.methods[visitor.scopes.at(-1)!].at(-1);
  lastQuadruple!.dest = whileCondition;
  whileGuard.src1 = lastQuadruple!.src2;
  whileGuard.src2 = lastQuadruple!.src1;
  whileGuard.operator = lastQuadruple!.operator;
  whileGuard.operatorVerbose = lastQuadruple!.operatorVerbose;

  visitor.addQuadruple(new MethodDeclaration(endWhile));

  return [{ size: 0, getTemporal: () => new TemporalValue() }];
}
