import { Primitive } from '../../';
import { DivisionContext } from '../../../antlr/yaplParser';
import { BinaryOperation } from '../Functions/BinaryOperation';
import { YaplVisitor } from '../visitor';

export function visitDivision(visitor: YaplVisitor, ctx: DivisionContext): Primitive[] {
  return BinaryOperation(visitor, ctx);
}
