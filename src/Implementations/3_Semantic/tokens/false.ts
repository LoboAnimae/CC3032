import { FalseContext } from 'antlr/yaplParser';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { BoolType } from 'Implementations/Generics';

export function visitFalse(_visitor: YaplVisitor, _ctx: FalseContext) {
  return new BoolType();
}
