import { BlockContext } from "../../../antlr/yaplParser";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";

export default function visitBlock(visitor: MemoryVisitor, ctx: BlockContext): IMemoryVisitor[] {
  return visitor.visitChildren(ctx);
}
