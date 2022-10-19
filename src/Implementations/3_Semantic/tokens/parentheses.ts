import { Primitive } from '../..';
import { ParenthesesContext } from '../../../antlr/yaplParser';
import { YaplVisitor } from '../visitor';

export function visitParentheses(visitor: YaplVisitor, ctx: ParenthesesContext): Primitive[] {
  return visitor.visit(ctx.expression());
}
