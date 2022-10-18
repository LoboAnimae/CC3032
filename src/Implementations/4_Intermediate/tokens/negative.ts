import { NegativeContext } from 'antlr/yaplParser';
import { IntType } from 'Implementations/Generics';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { NOT } from 'Implementations/4_Intermediate/Instructions';
import { TemporalValue } from 'Components/TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: NegativeContext): IMemoryVisitor[] {
  const expression = ctx.expression();
  const [expressionResult] = visitor.visit(expression);
  const expressionTemporal = expressionResult.getTemporal();
  const temporal = new TemporalValue();
  const size = IntType.Size;
  const getTemporal = () => temporal;
  visitor.addQuadruple(
    new NOT({
      saveIn: temporal,
      toNegate: expressionTemporal,
    }),
  );
  return [{ size, getTemporal }];
}
