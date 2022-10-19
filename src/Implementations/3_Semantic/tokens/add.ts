import { Primitive } from '../../';
import { AddContext } from '../../../antlr/yaplParser';
import { BinaryOperation } from '../Functions/BinaryOperation';
import { YaplVisitor } from '../visitor';

export function visitAdd(visitor: YaplVisitor, ctx: AddContext): Primitive[] {
  return BinaryOperation(visitor, ctx);
}
