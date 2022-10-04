import { PropertyContext } from '../../antlr/yaplParser';
import CompositionComponent from '../Components/Composition';
import { extractBasicInformation, extractTableComponent, extractValueComponent, TripletComponent } from '../Components';
import TypeComponent from '../Components/Type';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { ClassType } from '../Generics/Object.type';
import { lineAndColumn, YaplVisitor } from './meta';
import SimpleAssignment from '../Components/Triplet/SimpleAssignment';
import TemporalComponent from '../Components/TemporalComponent';

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
    scopeName: (propertyTypeClass.getName || extractBasicInformation(currentScope)!.getName)(),
    ...lineAndColumn(ctx),
    memoryAddress: visitor.register(),
  });
  const tripletElement = new SimpleAssignment();
  const tripletComponent = new TripletComponent();

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
    const referentialTemporalValue = new TemporalComponent(newTableElement);
    const propertyDefaultValue = propertyTypeClass.defaultValue;
    tripletElement.elements = [referentialTemporalValue, propertyDefaultValue.toString()];
    console.log();
  }

  const currentScopeTable = extractTableComponent(currentScope)!;

  const previousDeclared = currentScopeTable.get(propertyName.text, { inCurrentScope: true });
  // // Case 1: Overriding (It does nothing)
  if (previousDeclared) {
    visitor.addError(ctx, `Property ${propertyName.text} is already declared in ${currentScope.toString()}`);
    return visitor.next(ctx);
  }

  tripletComponent.merge(tripletElement);
  tripletComponent.printTable();
  newTableElement.addComponent(tripletComponent);
  // Case 2: Declaration of a new property
  currentScopeTable.add(newTableElement);
  return visitor.next(ctx);
}
