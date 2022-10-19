import { IntType, Primitive } from "../..";
import { IntContext } from "../../../antlr/yaplParser";
import { YaplVisitor } from "../visitor";

export function visitInt(visitor: YaplVisitor, ctx: IntContext): Primitive[] {
  return [new IntType()];
}
