import { StringContext } from 'antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { MemoryAddress, Move, StoreWord } from '../Instructions/MemoryManagement';
import { TemporalValue, V0 } from '../../../Components/TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: StringContext): IMemoryVisitor[] {
  const string = ctx.STRING().text.substring(1, ctx.STRING().text.length - 1);
  const temporal = new TemporalValue();
  const separated = [...string.split(''), '\0'];
  const returnTemporal = new TemporalValue();
  const size = separated.length;
  visitor.AskForHeapMemory(size);
  visitor.addQuadruple(
    new Move({
      dataMovesInto: returnTemporal,
      dataMovesFrom: new V0(),
      comment: 'Save the beginning position of the string',
    }),
  );
  let index = 0;
  for (const char of separated) {
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: char.charCodeAt(0) }));
    visitor.addQuadruple(
      new StoreWord({ dataMovesInto: new MemoryAddress(returnTemporal + ` + ${index++}`), dataMovesFrom: temporal }),
    );
  }

  return [{ size, getTemporal: () => returnTemporal }];
}
