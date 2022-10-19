import { BoolType, Primitive } from '../../';
import { FalseContext } from '../../../antlr/yaplParser';
import { YaplVisitor } from '../visitor';

export function visitFalse(_visitor: YaplVisitor, _ctx: FalseContext): Primitive[] {
  return [new BoolType()];
}
