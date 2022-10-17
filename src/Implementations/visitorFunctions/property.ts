import { PropertyContext } from '../../antlr/yaplParser';
import {
  extractBasicInformation,
  extractQuadruplet,
  extractTableComponent,
  extractValueComponent,
  ValueComponent,
} from '../Components';
import CompositionComponent from '../Components/Composition';
import SimpleAssignment from '../Components/Quadruple/SimpleAssignment';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { ClassType } from '../Generics/Object.type';
import { lineAndColumn } from './meta';
import { YaplVisitor } from '../../yaplVisitor';

export default function visitProperty(visitor: YaplVisitor, ctx: PropertyContext) {
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
    scopeName: (currentScope.getName || extractBasicInformation(currentScope)?.getName || (() => 'Unknown'))(),
    ...lineAndColumn(ctx),
  });
  newTableElement.setAddress(currentScope.getSize());
  const currentScopeTable = extractTableComponent(currentScope)!;

  const previousDeclared = currentScopeTable.get(propertyName.text, { inCurrentScope: true });
  // // Case 1: Overriding (It does nothing)
  if (previousDeclared) {
    visitor.addError(ctx, `Property ${propertyName.text} was previously declared in the current scope`);
    return visitor.next(ctx);
  }

  const simpleAssignment = new SimpleAssignment();

  if (propertyAssignmentExpression) {
    const assignmentResolvesTo: CompositionComponent = visitor.visit(propertyAssignmentExpression);
    const acceptsAssignment = propertyTypeClass.allowsAssignmentOf(assignmentResolvesTo);
    // ERROR: Not allowed an assignment and the assignment is not to an ancestor
    if (!acceptsAssignment) {
      // TODO: Fix visitor
      visitor.addError(
        ctx,
        `Cannot assign ${assignmentResolvesTo?.componentName ?? 'erroneous class'} to ${
          propertyTypeClass.componentName
        }`,
      );

      return visitor.next(ctx);
    }

    const valueHolder = extractValueComponent(assignmentResolvesTo);
    newTableElement.addComponent(valueHolder?.copy());
    const resolvingToAssignment = extractQuadruplet(assignmentResolvesTo);
    simpleAssignment.setValue(resolvingToAssignment);
    simpleAssignment.setAssigningTo(newTableElement);
    // visitor.addQuadruple(simpleAssignment);
  } else {
    simpleAssignment.setValue(propertyTypeClass.defaultValue);
    simpleAssignment.setAssigningTo(newTableElement);
    // visitor.addQuadruple(simpleAssignment);
    newTableElement.addComponent(new ValueComponent({ value: propertyTypeClass.defaultValue }));
  }

  // Case 2: Declaration of a new property
  currentScopeTable.add(newTableElement);
  return visitor.next(ctx);
}
