import { StringContext } from '../../../antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import { MemoryAddress, Move, StoreWord } from './Instructions/MemoryManagement';
import { TemporalValue } from './TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: StringContext): IMemoryVisitor[] {
  const string = ctx.STRING().text;
  const temporal = new TemporalValue();
  const separated = [...string.split(''), '\0'];
  const size = separated.length;
  visitor.AskForHeapMemory(size);
  let index = 0;
  for (const char of separated) {
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: char.charCodeAt(0) }));
    visitor.addQuadruple(
      new StoreWord({ dataMovesInto: new MemoryAddress(temporal + ` + ${index++}`), dataMovesFrom: temporal }),
    );
  }

  return [{ size, getTemporal: () => temporal }];
}
