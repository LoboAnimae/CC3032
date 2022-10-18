import { AssignmentContext } from 'antlr/yaplParser';
import {
  CompositionComponent,
  EmptyComponent,
  extractBasicInformation,
  extractTableComponent,
  extractTypeComponent,
} from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { TableElementType } from 'Implementations/DataStructures/TableElements';

export function visitAssignment(visitor: YaplVisitor, ctx: AssignmentContext) {
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

  // TODO: Add an assignment in here
  return new EmptyComponent(); // Assignments don't return anything
}
