import { IntType } from "../..";
import { IntContext } from "../../../antlr/yaplParser";
import { TemporalValue } from "../../../Components";
import { Move } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: IntContext): IMemoryVisitor[] {
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: parseInt(ctx.INT().text) }));
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
