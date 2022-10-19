import { Primitive } from '../../';
import { MinusContext } from '../../../antlr/yaplParser';
import { BinaryOperation } from '../Functions/BinaryOperation';
import { YaplVisitor } from '../visitor';

export function visitMinus(visitor: YaplVisitor, ctx: MinusContext): Primitive[] {
  return BinaryOperation(visitor, ctx);
}
