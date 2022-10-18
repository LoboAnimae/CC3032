import { lineAndColumn } from '../';
import { ClassType, MethodElement, SymbolElement } from '../../';
import { AssignmentExprContext } from '../../../antlr/yaplParser';
import {
  CompositionComponent,
  extractBasicInformation,
  extractTableComponent,
  extractValueComponent
} from '../../../Components';
import { YaplVisitor } from '../visitor';

export function visitAssignmentExpr(visitor: YaplVisitor, ctx: AssignmentExprContext) {
  // Previous table
  const propertyName = ctx.IDENTIFIER();
  const propertyType = ctx.TYPE();
  const propertyAssignmentExpression = ctx.expression();

  const propertyTypeClass: ClassType | null = visitor.findTable(propertyType);
  const currentScope: ClassType | MethodElement = visitor.getCurrentScope();

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
    visitor.addError(ctx, `Property ${propertyName.text} was previously declared in the current scope`);
    return visitor.next(ctx);
  }

  if (propertyAssignmentExpression) {
    const assignmentResolvesTo: CompositionComponent = visitor.visit(propertyAssignmentExpression);
    const acceptsAssignment = propertyTypeClass.allowsAssignmentOf(assignmentResolvesTo);
    // ERROR: Not allowed an assignment and the assignment is not to an ancestor
    if (!acceptsAssignment) {
      // TODO: Fix visitor
      visitor.addError(
        ctx,
        `Cannot assign ${assignmentResolvesTo?.componentName ?? 'erroneous class'} to ${propertyTypeClass.componentName
        }`,
      );
      return visitor.next(ctx);
    }

    const valueHolder = extractValueComponent(assignmentResolvesTo);
    newTableElement.addComponent(valueHolder?.copy());
    // visitor.addQuadruple(simpleAssignment);
  }

  // Case 2: Declaration of a new property
  currentScopeTable.add(newTableElement);
  return newTableElement;
}
