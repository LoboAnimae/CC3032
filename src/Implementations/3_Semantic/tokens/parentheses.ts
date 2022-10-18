import { ParenthesesContext } from 'antlr/yaplParser';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';

export function visitParentheses(visitor: YaplVisitor, ctx: ParenthesesContext) {
  return visitor.visit(ctx.expression());
}
