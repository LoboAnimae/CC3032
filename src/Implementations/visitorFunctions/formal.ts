import { FormalContext } from '../../antlr/yaplParser';
import CompositionComponent from '../Components/Composition';
import EmptyComponent from '../Components/EmptyComponent';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { lineAndColumn, YaplVisitor } from './meta';
import { ClassType } from '../Generics/Object.type';

export default function visitFormal(visitor: YaplVisitor, ctx: FormalContext) {
  const paramName = ctx.IDENTIFIER();
  const dataType = ctx.TYPE();
  const foundTable: ClassType | null | undefined = visitor.findTable(dataType)?.copy() as ClassType;

  // ERROR: The type is not yet defined
  if (!foundTable) {
    visitor.addError(ctx, `Type ${dataType.text} is not (yet?) defined`);
    return new EmptyComponent();
  }
  const newSymbol = new SymbolElement({
    name: paramName.text,
    type: foundTable,
    scopeName: visitor.getCurrentScope().getName(),
    ...lineAndColumn(ctx), // TODO: Add pass-by-reference or pass-by-value logic with memory addresses
  });
  return newSymbol;
}
