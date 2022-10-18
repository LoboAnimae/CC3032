import { IdContext } from 'antlr/yaplParser';
import { EmptyComponent, extractBasicInformation, extractTableComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { TableElementType } from 'Implementations/DataStructures/TableElements';

export function visitId(visitor: YaplVisitor, ctx: IdContext) {
  // Find it in the scope
  const name = ctx.IDENTIFIER();
  const currentScope = visitor.getCurrentScope();

  if (name.text.toLocaleLowerCase() === 'self') {
    return currentScope;
  }

  const tableComponent = extractTableComponent<TableElementType>(currentScope);
  if (!tableComponent) {
    return new EmptyComponent();
  }

  const foundComponent: TableElementType | null = tableComponent.get(name.text);

  if (!foundComponent) {
    const basicInfo = extractBasicInformation(currentScope);
    visitor.addError(ctx, `Symbol '${name.toString()}' is not defined in scope '${basicInfo!.name}'`);
    return new EmptyComponent();
  }

  return foundComponent;
}
