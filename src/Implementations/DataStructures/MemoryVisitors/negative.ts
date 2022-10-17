import { NegativeContext } from '../antlr/yaplParser';
import IntType from '../../Generics/Integer.type';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { NOT } from './Instructions/Bitwise';
import { TemporalValue } from './TemporaryValues';

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
