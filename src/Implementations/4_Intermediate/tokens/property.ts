import { PropertyContext } from 'antlr/yaplParser';
import CompositionComponent from 'Components';
import TableComponent, { extractTableComponent } from 'Components';
import { extractTypeComponent } from 'Components';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import MethodElement from 'Implementations/DataStructures/TableElements';
import SymbolElement from 'Implementations/DataStructures/TableElements';
import { Move, StoreWord } from '../Instructions/MemoryManagement';
import { Comment } from '../Instructions/Misc';
import { V0 } from '../../../Components/TemporaryValues';
export default function (visitor: MemoryVisitor, ctx: PropertyContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const currentClassTable = visitor.currentClassTable();
  const referencedVariable = currentClassTable.get(name)! as SymbolElement;
  visitor.addQuadruple(new Comment(`Begin Property ${name.text}\n`));
  visitor.classStack.push(referencedVariable);
  const [result] = visitor.visitChildren(ctx);
  visitor.classStack.pop();
  const table = extractTableComponent(referencedVariable) as TableComponent<CompositionComponent>;
  if (table) {
    const newTable = table.copy() as TableComponent<CompositionComponent>;
    for (const element of newTable.getAll()) {
      if (element.componentName === MethodElement.Name) continue;
      const currentElement = element as SymbolElement;
      currentElement.setMemoryAddress(currentElement.getMemoryAddress() + referencedVariable.getMemoryAddress());
    }
    referencedVariable.replaceComponent(newTable);
  }
  const temporal: any = result.getTemporal();
  if (!result.save) {
    visitor.addQuadruple(
      new StoreWord({
        dataMovesFrom: temporal,
        dataMovesInto: referencedVariable.toString(),
      }),
    );
  }
  referencedVariable.setMemoryAddress(visitor.memoryOffset);
  visitor.register(referencedVariable.id, result.size);
  visitor.addQuadruple(new Comment(`End Property ${name.text}\n`));

  const size = referencedVariable.getSize();
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
