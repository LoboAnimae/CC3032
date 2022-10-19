import { ErrorType, Primitive, TableElementType } from '../../';
import { IdContext } from '../../../antlr/yaplParser';
import { EmptyComponent, extractBasicInformation, extractTableComponent } from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitId(visitor: YaplVisitor, ctx: IdContext): Primitive[] {
  // Find it in the scope
  const name = ctx.IDENTIFIER();
  const currentScope = visitor.getCurrentScope() as unknown as Primitive;

  if (name.text.toLocaleLowerCase() === 'self') {
    return [currentScope];
  }

  const tableComponent = extractTableComponent<TableElementType>(currentScope);
  if (!tableComponent) {
    return [new ErrorType()];
  }

  const foundComponent = tableComponent.get(name.text) as unknown as Primitive;

  if (!foundComponent) {
    const basicInfo = extractBasicInformation(currentScope);
    const message = `Symbol ${Color.member(name.toString())} is not defined in the scope of ${Color.scope(basicInfo!.name!)}`;
    visitor.addError(ctx, message);
    return [new ErrorType()];
  }

  return [foundComponent];
}
