import { TrueContext } from 'antlr/yaplParser';
import { BoolType } from 'Implementations/Generics';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';

export function visitTrue(_visitor: YaplVisitor, _ctx: TrueContext) {
  return new BoolType();
}
