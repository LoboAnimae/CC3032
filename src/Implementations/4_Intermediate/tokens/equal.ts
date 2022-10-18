import { EqualContext } from 'antlr/yaplParser';
import { TemporalValue } from 'Components/TemporaryValues';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { BoolType } from 'Implementations/Generics';
import { EQUAL } from '../Instructions/Comparison';

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
