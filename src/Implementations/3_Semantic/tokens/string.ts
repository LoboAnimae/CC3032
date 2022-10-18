import { StringContext } from 'antlr/yaplParser';
import { StringType } from 'Implementations/Generics';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';

export function visitString(_visitor: YaplVisitor, _ctx: StringContext) {
  return new StringType();
}
