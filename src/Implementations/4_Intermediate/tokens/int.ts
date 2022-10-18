import { IntContext } from 'antlr/yaplParser';
import IntType from 'Implementations/Generics';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { Move } from '../Instructions/MemoryManagement';
import { TemporalValue } from '../../../Components/TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: IntContext): IMemoryVisitor[] {
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: parseInt(ctx.INT().text) }));
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
