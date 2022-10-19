import { Primitive } from '../../';
import { LessEqualContext } from '../../../antlr/yaplParser';
import { ComparisonFunction } from '../Functions/ComparisonOperation';
import { YaplVisitor } from '../visitor';

export function visitLessEqual(visitor: YaplVisitor, ctx: LessEqualContext): Primitive[] {
  return ComparisonFunction(visitor, ctx);
}
