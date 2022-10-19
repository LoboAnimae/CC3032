import { Primitive } from '../../';
import { MultiplyContext } from '../../../antlr/yaplParser';
import { BinaryOperation } from '../Functions/BinaryOperation';
import { YaplVisitor } from '../visitor';

export function visitMultiply(visitor: YaplVisitor, ctx: MultiplyContext): Primitive[] {
  return BinaryOperation(visitor, ctx);
}
