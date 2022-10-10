import { FormalContext } from '../../antlr/yaplParser';
import EmptyComponent from '../Components/EmptyComponent';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { ClassType } from '../Generics/Object.type';
import { lineAndColumn, YaplVisitor } from './meta';

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
