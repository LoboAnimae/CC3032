import { ErrorType, Primitive, TableElementType } from '../../';
import { AssignmentContext } from '../../../antlr/yaplParser';
import {
  CompositionComponent,
  EmptyComponent,
  extractBasicInformation,
  extractTableComponent,
  extractTypeComponent,
  isEmptyComponent
} from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitAssignment(visitor: YaplVisitor, ctx: AssignmentContext): Primitive[] {
  const assignmentTo = ctx.IDENTIFIER();
  const [assignmentValue] = visitor.visit(ctx.expression());

  const assignmentValueBasicInfo = extractBasicInformation(assignmentValue);

  const currentScope = visitor.getCurrentScope()!;
  const currentScopeBasicInfo = extractBasicInformation(currentScope);

  const tableComponent = extractTableComponent<TableElementType>(currentScope)!;

  const foundSymbol: CompositionComponent | null = tableComponent.get(assignmentTo.text);
  const symbolBasicInformation = extractBasicInformation(foundSymbol);
  const symbolType = extractTypeComponent(foundSymbol);

  // ERROR: The variable does not exist yet
  if (!foundSymbol) {
    const symbol = Color.member('Symbol');
    const member = Color.member(assignmentTo.text);
    const scope = Color.scope(currentScopeBasicInfo!.name!);
    const message = `${symbol} ${member} is not defined in ${Color.scope('scope')} ${scope}`;
    visitor.addError(ctx, message);
    return [new ErrorType()];
  }

  const allowed = symbolType?.allowsAssignmentOf(assignmentValue);
  if (!allowed) {
    let message;
    if (isEmptyComponent(assignmentValue)) {
      message = `Expression resolved to ${Color.error('error')} type, and can't be assigned to ${Color.member(symbolBasicInformation!.name!)}`;
    } else {
      message = `Can't assign ${Color.class(assignmentValueBasicInfo!.name!)} to ${Color.member(symbolBasicInformation!.name!)}`;
    }
    visitor.addError(ctx, message);
  }

  // TODO: Add an assignment in here
  return [new ErrorType()]; // Assignments don't return anything
}
