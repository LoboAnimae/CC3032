import { BoolType, Primitive } from "../..";
import { TrueContext } from "../../../antlr/yaplParser";
import { YaplVisitor } from "../visitor";


export function visitTrue(_visitor: YaplVisitor, _ctx: TrueContext): Primitive[] {
  return [new BoolType()];
}
