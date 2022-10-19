import { BoolType } from "../..";
import { TrueContext } from "../../../antlr/yaplParser";
import { TemporalValue } from "../../../Components";
import { Move } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: TrueContext): IMemoryVisitor[] {
  const size = BoolType.Size;
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: 1 }));
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
