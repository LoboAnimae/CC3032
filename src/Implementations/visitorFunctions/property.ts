import { PropertyContext } from '../../antlr/yaplParser';
import CompositionComponent from '../Components/Composition';
import { extractTableComponent, extractValueComponent, QuadrupleComponent } from '../Components';
import TypeComponent from '../Components/Type';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { ClassType } from '../Generics/Object.type';
import { lineAndColumn, YaplVisitor } from './meta';
import SimpleAssignment from '../Components/Quadruple/SimpleAssignment';

export default function visitProperty(visitor: YaplVisitor, ctx: PropertyContext) {
  // Previous table
  const propertyName = ctx.IDENTIFIER();
  const propertyType = ctx.TYPE();
  const propertyAssignmentExpression = ctx.expression();

  const propertyTypeClass: TypeComponent | null = visitor.findTable(propertyType);

  // ERROR: The type is not yet defined
  if (!propertyTypeClass) {
    visitor.addError(ctx, `Type ${propertyType.text} is not (yet?) defined`);
    return visitor.next(ctx);
  }

  const newTableElement = new SymbolElement({
    name: propertyName.text,
    type: propertyTypeClass,
    ...lineAndColumn(ctx),
  });
  const quadrupleElement = new SimpleAssignment();
  const quadrupleComponent = new QuadrupleComponent()

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
        } (Can't assign type ${assignmentResolvesTo?.componentName ?? ''} to ${propertyTypeClass.componentName})`,
      );
      return visitor.next(ctx);
    }

    const valueHolder = extractValueComponent(assignmentResolvesTo);
    newTableElement.addComponent(valueHolder?.copy());
  } else {
    const propertyDefaultValue = propertyTypeClass.defaultValue
    quadrupleElement.elements = [newTableElement.referentialID, propertyDefaultValue.toString()];
    console.log()
  }

  const currentScope: ClassType | MethodElement = visitor.getCurrentScope();
  const currentScopeTable = extractTableComponent(currentScope)!;

  const previousDeclared = currentScopeTable.get(propertyName.text, { inCurrentScope: true });
  // // Case 1: Overriding (It does nothing)
  if (previousDeclared) {
    visitor.addError(ctx, `Property ${propertyName.text} is already declared in ${currentScope.toString()}`);
    return visitor.next(ctx);
  }

  quadrupleComponent.merge(quadrupleElement)
  quadrupleComponent.printTable()
  newTableElement.addComponent(quadrupleComponent)
  // Case 2: Declaration of a new property
  currentScopeTable.add(newTableElement);
  return visitor.next(ctx);
}
