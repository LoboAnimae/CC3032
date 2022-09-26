import { ParenthesesContext } from '../../antlr/yaplParser';
import { YaplVisitor } from './meta';

export default function visitParentheses(visitor: YaplVisitor, ctx: ParenthesesContext) {
  return visitor.visit(ctx.expression());
}
