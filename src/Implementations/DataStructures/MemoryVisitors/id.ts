import { IdContext } from '../../../antlr/yaplParser';
import { extractTableComponent } from '../../Components/Table';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import SymbolElement from '../TableElements/SymbolElement';
import { LoadWord, MemoryAddress, Move } from './Instructions/MemoryManagement';
import { STACK_POINTER, TemporalValue } from './TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: IdContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const currentTable = visitor.currentClassTable();
  const found = currentTable.get(name.text)! as SymbolElement;
  const inTable = currentTable.getAll();
  const thisTemporal = new TemporalValue();
  const foundTemporal = inTable.find((el) => (el as SymbolElement).getName() === name.text) as SymbolElement;
  const size = found.getSize();
  if (foundTemporal) {
    thisTemporal.id = foundTemporal.id;
    visitor.addQuadruple(
      new LoadWord({
        dataMovesFrom: new STACK_POINTER(foundTemporal.getMemoryAddress()),
        dataMovesInto: thisTemporal,
      }),
    );
    return [{ size, getTemporal: () => thisTemporal }];
    // If it is in the table, use it's temporal
  } else if (found) {
    const currentClass = visitor.currentClass(-1);
    const currentClassTable = extractTableComponent(currentClass)!;
    const elementInClass = currentClassTable.get(name.text)! as SymbolElement;
    visitor.addQuadruple(
      new Move({
        dataMovesInto: thisTemporal,
        dataMovesFrom: new MemoryAddress(elementInClass.getMemoryAddress()),
        comment: `Load value "${name}" from the method's memory`,
      }),
    );
  }
  const returnValue: IMemoryVisitor = {
    getTemporal: () => thisTemporal,
    size,
  };
  return [returnValue];
}
