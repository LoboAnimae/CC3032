import { BoolType } from "../..";
import { FalseContext } from "../../../antlr/yaplParser";
import { TemporalValue } from "../../../Components";
import { Move } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, _ctx: FalseContext): IMemoryVisitor[] {
  const size = BoolType.Size;
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: 0 }));
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
