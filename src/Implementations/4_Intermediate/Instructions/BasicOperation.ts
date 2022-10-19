import { AddContext, MinusContext, MultiplyContext, DivisionContext } from "../../../antlr/yaplParser";
import { TemporalValue } from "../../../Components";
import { MemoryVisitor } from "../visitor";

export function basicOperation(
  visitor: MemoryVisitor,
  ctx: AddContext | MinusContext | MultiplyContext | DivisionContext,
): [TemporalValue, TemporalValue, TemporalValue] {
  const [leftChild, rightChild] = ctx.expression();
  const [leftChildResult] = visitor.visit(leftChild);
  const [rightChildResult] = visitor.visit(rightChild);
  const leftChildTemporal = leftChildResult.getTemporal();
  const rightChildTemporal = rightChildResult.getTemporal();
  const temporal = new TemporalValue();
  return [leftChildTemporal, rightChildTemporal, temporal];
}
