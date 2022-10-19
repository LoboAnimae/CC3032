import { Primitive } from '../..';
import { WhileContext } from '../../../antlr/yaplParser';
import { YaplVisitor } from '../visitor';

export function visitWhile(visitor: YaplVisitor, ctx: WhileContext): Primitive[] {
  const [booleanExpression, subResult] = ctx.expression();

  // There is no expression inside the while loop
  if (!booleanExpression) {
    return visitor.next(ctx);
  }
  const [foundExpression] = visitor.visit(booleanExpression);

  const boolTable = visitor.findTable('Bool')!;
  const allowsAssignment = boolTable.allowsAssignmentOf(foundExpression);
  // ERROR: The expression inside the while loop cannot be set as a boolean expression
  if (!allowsAssignment) {
    visitor.addError(
      ctx,
      `Expression inside while loop cannot be set as a boolean expression (got ${foundExpression.componentName})`,
    );
    visitor.next(ctx);
  }
  return visitor.visit(subResult)!;
}
