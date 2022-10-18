import { BlockContext } from 'antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';

export default function visitBlock(visitor: MemoryVisitor, ctx: BlockContext): IMemoryVisitor[] {
  return visitor.visitChildren(ctx);
}
