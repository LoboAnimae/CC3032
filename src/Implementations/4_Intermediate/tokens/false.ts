import { FalseContext } from 'antlr/yaplParser';
import { TemporalValue } from 'Components/TemporaryValues';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { BoolType } from 'Implementations/Generics';
import { Move } from '../Instructions/MemoryManagement';

export default function (visitor: MemoryVisitor, _ctx: FalseContext): IMemoryVisitor[] {
  const size = BoolType.Size;
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: 0 }));
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
