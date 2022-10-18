import { IntContext } from 'antlr/yaplParser';
import { TemporalValue } from 'Components/TemporaryValues';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { IntType } from 'Implementations/Generics';
import { Move } from '../Instructions/MemoryManagement';

export default function (visitor: MemoryVisitor, ctx: IntContext): IMemoryVisitor[] {
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: parseInt(ctx.INT().text) }));
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
