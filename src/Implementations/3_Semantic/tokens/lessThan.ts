import { Primitive } from '../../';
import { LessThanContext } from '../../../antlr/yaplParser';
import { ComparisonFunction } from '../Functions/ComparisonOperation';
import { YaplVisitor } from '../visitor';

export function visitLessThan(visitor: YaplVisitor, ctx: LessThanContext): Primitive[] {
  return ComparisonFunction(visitor, ctx);
}
