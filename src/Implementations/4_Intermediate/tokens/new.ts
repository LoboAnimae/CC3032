import { SymbolElement, ClassType } from "../..";
import { NewContext } from "../../../antlr/yaplParser";
import { TemporalValue, V0, extractTableComponent, extractValueComponent, extractTypeComponent } from "../../../Components";
import { Move, StoreWord } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: NewContext): IMemoryVisitor[] {
  const type = ctx.TYPE();
  const memoryBeginning = new TemporalValue();
  const currentClass = visitor.currentClass() as SymbolElement;
  const referencedType = visitor.symbolsTable.get(type.text)! as ClassType;
  const size = referencedType.getSize();
  visitor.AskForHeapMemory(size);
  visitor.addQuadruple(new Move({ dataMovesInto: memoryBeginning, dataMovesFrom: new V0() }));

  const referencedTypeTable = extractTableComponent(referencedType)!;
  const allElements = referencedTypeTable.filter(SymbolElement.Name) as SymbolElement[];
  for (const element of allElements) {
    const valueHolder = extractValueComponent(element);
    const type = extractTypeComponent(element);
    const temporal = new TemporalValue();
    if (valueHolder) {
      visitor.addQuadruple(
        new Move({
          dataMovesInto: temporal,
          dataMovesFrom: valueHolder.getValue(),
        }),
        new StoreWord({
          dataMovesFrom: temporal,
          dataMovesInto: element.toString(),
          offset: memoryBeginning.toString(),
        }),
      );
    } else {
      visitor.addQuadruple(
        new Move({
          dataMovesInto: temporal,
          dataMovesFrom: type!.defaultValue,
        }),
        new StoreWord({
          dataMovesFrom: temporal,
          dataMovesInto: element.toString(),
          offset: memoryBeginning.toString(),
        }),
      );
    }
  }

  return [{ size, getTemporal: () => new TemporalValue(), save: true }];
}
