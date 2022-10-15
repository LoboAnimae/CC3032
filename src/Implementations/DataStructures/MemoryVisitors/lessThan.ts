import { LessThanContext } from '../../../antlr/yaplParser';
import BoolType from '../../Generics/Boolean.type';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { LESSTHAN } from './Instructions/Comparison';
import { TemporalValue } from './TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: LessThanContext): IMemoryVisitor[] {
  const [leftExpression, rightExpression] = ctx.expression();
  const [left] = visitor.visit(leftExpression);
  const [right] = visitor.visit(rightExpression);
  const temporal = new TemporalValue();

  visitor.addQuadruple(
    new LESSTHAN({
      fistOperand: left.getTemporal(),
      secondOperand: right.getTemporal(),
      goTo: temporal.toString(),
    }),
  );

  return [{ size: BoolType.Size, getTemporal: () => temporal }];
}
