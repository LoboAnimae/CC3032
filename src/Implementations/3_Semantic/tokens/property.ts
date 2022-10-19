import { lineAndColumn } from '../';
import { ClassType, MethodElement, ObjectType, Primitive, SymbolElement } from '../../';
import { PropertyContext } from '../../../antlr/yaplParser';
import {
  CompositionComponent,
  extractBasicInformation,
  extractTableComponent,
  extractTypeComponent,
  extractValueComponent,
  isEmptyComponent,
  ValueComponent
} from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';


export function visitProperty(visitor: YaplVisitor, ctx: PropertyContext): Primitive[] {
  // Previous table
  const propertyName = ctx.IDENTIFIER();
  const propertyType = ctx.TYPE();
  const propertyAssignmentExpression = ctx.expression();

  let propertyTypeClass: ClassType | null = visitor.findTable(propertyType);
  const currentScope: ClassType | MethodElement = visitor.getCurrentScope();
  let assignmentResolvesTo = undefined;
  // ERROR: The type is not yet defined
  if (!propertyTypeClass) {
    visitor.addError(ctx, `Type ${propertyType.text} is not (yet?) defined`);
    propertyTypeClass = visitor.findTable(ObjectType.Name)!;
  }
  const classtype = extractTypeComponent(propertyTypeClass);

  const newTableElement = new SymbolElement({
    name: propertyName.text,
    type: propertyTypeClass,
    scopeName: (currentScope.getName || extractBasicInformation(currentScope)?.getName || (() => 'Unknown'))(),
    ...lineAndColumn(ctx),
  });
  newTableElement.setAddress(currentScope.getSize());
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
      if (!isEmptyComponent(assignmentResolvesTo))  {
        const message = `Expression of type ${Color.class(assignmentResolvesTo.componentName)} can't be assigned to property ${Color.member(propertyName.text)} (${Color.class(propertyTypeClass.componentName)})`;
        visitor.addError(ctx, message);
      }
    }
  }

  // Case 2: Declaration of a new property
  if (!previousDeclared) currentScopeTable.add(newTableElement);
  return [classtype as Primitive];
}
