import { BlockContext } from '../../antlr/yaplParser';
import { EmptyComponent } from '../Components/index';
import { YaplVisitor } from './meta';

export default function visitBlock(visitor: YaplVisitor, ctx: BlockContext) {
  // Return only the last thing in the block
  const resultingExpression = visitor.visitChildren(ctx);
  if (!resultingExpression) {
    visitor.addError(ctx, 'Empty code block');
    return new EmptyComponent();
  }
  const lastChild = Array.isArray(resultingExpression) ? resultingExpression.at(-1) : resultingExpression;
  return lastChild;
}
