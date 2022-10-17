import { EqualContext } from '../antlr/yaplParser';
import BoolType from '../../Generics/Boolean.type';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { EQUAL } from './Instructions/Comparison';
import { Move } from './Instructions/MemoryManagement';
import { TemporalValue } from './TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: EqualContext): IMemoryVisitor[] {
  const [leftExpression, rightExpression] = ctx.expression();
  const [left] = visitor.visit(leftExpression);
  const [right] = visitor.visit(rightExpression);
  const temporal = new TemporalValue();

  visitor.addQuadruple(
    new EQUAL({
      fistOperand: left.getTemporal(),
      secondOperand: right.getTemporal(),
      goTo: temporal.toString(),
    }),
  );

  return [{ size: BoolType.Size, getTemporal: () => temporal }];
}
