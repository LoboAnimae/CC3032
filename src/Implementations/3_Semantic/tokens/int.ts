import { IntContext } from 'antlr/yaplParser';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { IntType } from 'Implementations/Generics/Integer.type';

export function visitInt(visitor: YaplVisitor, ctx: IntContext) {
  return new IntType();
}
