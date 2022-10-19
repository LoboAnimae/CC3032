import { Primitive, StringType } from "../..";
import { StringContext } from "../../../antlr/yaplParser";
import { YaplVisitor } from "../visitor";


export function visitString(_visitor: YaplVisitor, _ctx: StringContext): Primitive[] {
  return [new StringType()];
}
