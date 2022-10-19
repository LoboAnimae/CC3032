import { Primitive } from '../..';
import { EqualContext } from '../../../antlr/yaplParser';
import { ComparisonFunction } from '../Functions/ComparisonOperation';
import { YaplVisitor } from '../visitor';

export function visitEqual(visitor: YaplVisitor, ctx: EqualContext): Primitive[] {
  return ComparisonFunction(visitor, ctx);
}
