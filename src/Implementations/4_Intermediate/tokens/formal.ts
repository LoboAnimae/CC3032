import { SymbolElement } from "../..";
import { FormalContext } from "../../../antlr/yaplParser";
import { TemporalValue, STACK_POINTER } from "../../../Components";
import { Move, MemoryAddress } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: FormalContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const currentClassTable = visitor.currentClassTable()!;
  const newTemporal = new TemporalValue();
  const symbol = currentClassTable.get(name.text) as SymbolElement;
  newTemporal.id = symbol.id;
  // const dataMovesFrom = new MemoryAddress(new STACK_POINTER(visitor.stackMemoryOffset))
  // console.log(dataMovesFrom.toString())
  // visitor.addQuadruple(
  //   new Move({
  //     dataMovesFrom: new MemoryAddress(new STACK_POINTER(visitor.stackMemoryOffset)),
  //     dataMovesInto: newTemporal,
  //     comment: `Parameters are passed through the stack`,
  //   }),
  // );
  const size = symbol.getSize();
  const getTemporal = () => newTemporal;
  return [{ size, getTemporal }];
}
