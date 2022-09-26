import { AssignmentContext } from '../../antlr/yaplParser';
import { extractBasicInformation } from '../Components/BasicInformation';
import { CompositionComponent, EmptyComponent, extractTableComponent, extractTypeComponent } from '../Components/index';
import { TableElementType } from '../DataStructures/TableElements/index';
import { YaplVisitor } from './meta';

export default function visitAssignment(visitor: YaplVisitor, ctx: AssignmentContext) {
  const assignmentTo = ctx.IDENTIFIER();
  const assignmentValue: CompositionComponent = visitor.visit(ctx.expression());

  const assignmentValueBasicInfo = extractBasicInformation(assignmentValue);

  const currentScope = visitor.getCurrentScope()!;
  const currentScopeBasicInfo = extractBasicInformation(currentScope);

  const tableComponent = extractTableComponent<TableElementType>(currentScope)!;

  const foundSymbol: CompositionComponent | null = tableComponent.get(assignmentTo.text);
  const symbolBasicInformation = extractBasicInformation(foundSymbol);
  const symbolType = extractTypeComponent(foundSymbol);

  // ERROR: The variable does not exist yet
  if (!foundSymbol) {
    visitor.addError(ctx, `Symbol ${assignmentTo.text} is not defined in scope ${currentScopeBasicInfo?.getName()}`);
    return new EmptyComponent();
  }

  const allowed = symbolType?.allowsAssignmentOf(assignmentValue);
  if (!allowed) {
    visitor.addError(
      ctx,
      `Cannot assign ${assignmentValueBasicInfo?.getName()} to ${symbolBasicInformation?.getName()}`,
    );
  }
  return new EmptyComponent(); // Assignments don't return anything
}
