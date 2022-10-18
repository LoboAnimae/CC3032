import { TrueContext } from 'antlr/yaplParser';
import BoolType from 'Implementations/Generics';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { Move } from '../Instructions/MemoryManagement';
import { TemporalValue } from '../../../Components/TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: TrueContext): IMemoryVisitor[] {
  const size = BoolType.Size;
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: 1 }));
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
