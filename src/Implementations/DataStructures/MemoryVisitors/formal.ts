import { FormalContext } from '../antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import SymbolElement from '../TableElements/SymbolElement';
import { MemoryAddress, Move } from './Instructions/MemoryManagement';
import { STACK_POINTER, TemporalValue } from './TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: FormalContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const currentClassTable = visitor.currentClassTable()!;
  const newTemporal = new TemporalValue();
  const symbol = currentClassTable.get(name.text) as SymbolElement;
  newTemporal.id = symbol.id;

  visitor.addQuadruple(
    new Move({
      dataMovesFrom: new MemoryAddress(new STACK_POINTER(visitor.stackMemoryOffset)),
      dataMovesInto: newTemporal,
      comment: `Parameters are passed through the stack`,
    }),
  );
  visitor.stackMemoryOffset += symbol!.getSize();
  const size = symbol.getSize();
  const getTemporal = () => newTemporal;
  return [{ size, getTemporal }];
}
