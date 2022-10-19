import { lineAndColumn } from '../';
import { ClassType, ErrorType, MethodElement, Primitive, SymbolElement } from '../../';
import { FormalContext } from '../../../antlr/yaplParser';
import { extractTypeComponent } from '../../../Components';
import { YaplVisitor } from '../visitor';

export function visitFormal(visitor: YaplVisitor, ctx: FormalContext): Primitive[] {
  const paramName = ctx.IDENTIFIER();
  const dataType = ctx.TYPE();
  const foundTable: ClassType | null | undefined = visitor.findTable(dataType)?.copy() as ClassType;
  const currentScope = visitor.getCurrentScope<MethodElement>();
  const newSymbol = new SymbolElement({
    name: paramName.text,
    type: foundTable,
    scopeName: visitor.getCurrentScope().getName(),
    ...lineAndColumn(ctx), // TODO: Add pass-by-reference or pass-by-value logic with memory addresses
  });
  currentScope.addParameters(newSymbol);
  const classType = extractTypeComponent(foundTable);
  return [classType as Primitive];
}
