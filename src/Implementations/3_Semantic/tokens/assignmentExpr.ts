import { lineAndColumn } from '../';
import { ClassType, MethodElement, Primitive, SymbolElement } from '../../';
import { AssignmentExprContext } from '../../../antlr/yaplParser';
import {
  CompositionComponent,
  extractBasicInformation,
  extractTableComponent,
  extractTypeComponent,
  extractValueComponent,
  isEmptyComponent
} from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitAssignmentExpr(visitor: YaplVisitor, ctx: AssignmentExprContext): Primitive[] {
  // Previous table
  const propertyName = ctx.IDENTIFIER();
  const propertyType = ctx.TYPE();
  const propertyAssignmentExpression = ctx.expression();
  let assignmentResolvesTo;

  const propertyTypeClass: ClassType | null = visitor.findTable(propertyType);
  const currentScope: ClassType | MethodElement = visitor.getCurrentScope();
  const classType = extractTypeComponent(propertyTypeClass);

  // ERROR: The type is not yet defined
  if (!propertyTypeClass) {
    visitor.addError(ctx, `Type ${propertyType.text} is not (yet?) defined`);
    return visitor.next(ctx);
  }

  const newTableElement = new SymbolElement({
    name: propertyName.text,
    type: propertyTypeClass,
    scopeName: extractBasicInformation(currentScope)!.getName()!,
    ...lineAndColumn(ctx),
  });
  const currentScopeTable = extractTableComponent(currentScope)!;

  const previousDeclared = currentScopeTable.get(propertyName.text, { inCurrentScope: true });
  // // Case 1: Overriding (It does nothing)
  if (previousDeclared) {
    const scope = (currentScope.componentName === MethodElement.Name ? Color.scope : Color.class)(currentScope.componentName);
    const message = `Property ${Color.member(propertyName.text)} was previously declared in the scope ${scope}`;
    visitor.addError(ctx, message);
  }

  if (propertyAssignmentExpression) {
    assignmentResolvesTo = visitor.visit(propertyAssignmentExpression)[0];
    const acceptsAssignment = propertyTypeClass.allowsAssignmentOf(assignmentResolvesTo);
    // ERROR: Not allowed an assignment and the assignment is not to an ancestor
    if (!acceptsAssignment) {
      if (isEmptyComponent(assignmentResolvesTo)) {
        const message = `Expression resolved to an ${Color.error('error')} and can't be assigned to property ${Color.member(propertyName.text)}`;
        visitor.addError(ctx, message);
      } else {
        const message = `Expression of type ${Color.class(assignmentResolvesTo.componentName)} can't be assigned to property ${Color.member(propertyName.text)} (${Color.class(propertyTypeClass.componentName)})`;
        visitor.addError(ctx, message);
      }
    }
    // visitor.addQuadruple(simpleAssignment);
  }

  // Case 2: Declaration of a new property
  if (!previousDeclared) currentScopeTable.add(newTableElement);
  return [classType as Primitive];
}
