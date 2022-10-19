import { IntType } from "../..";
import { NegativeContext } from "../../../antlr/yaplParser";
import { TemporalValue } from "../../../Components";
import { NOT } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";

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
