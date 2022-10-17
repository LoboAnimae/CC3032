import { BlockContext } from "../antlr/yaplParser";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";

export default function visitBlock(visitor: MemoryVisitor, ctx: BlockContext): IMemoryVisitor[] {
    return visitor.visitChildren(ctx);
}