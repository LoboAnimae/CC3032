import { ErrorType, Primitive } from '../..';
import { BlockContext } from '../../../antlr/yaplParser';
import { YaplVisitor } from '../visitor';

export function visitBlock(visitor: YaplVisitor, ctx: BlockContext): Primitive[] {
  // Return only the last thing in the block
  const resultingExpression = visitor.visitChildren(ctx);
  if (!resultingExpression) {
    visitor.addError(ctx, 'Empty code block');
    return [new ErrorType()];
  }
  const lastChild = resultingExpression.at(-1) as Primitive;
  return [lastChild];
}
