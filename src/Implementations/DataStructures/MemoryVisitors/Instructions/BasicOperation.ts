import { AddContext, DivisionContext, MinusContext, MultiplyContext } from "../../antlr/yaplParser";
import { IMemoryVisitor, MemoryVisitor } from "../../Memory";
import { TemporalValue } from "../TemporaryValues";

export default function basicOperation(visitor: MemoryVisitor, ctx: AddContext | MinusContext | MultiplyContext | DivisionContext): [TemporalValue, TemporalValue, TemporalValue] {
    const [leftChild, rightChild] = ctx.expression();
    const [leftChildResult] = visitor.visit(leftChild);
    const [rightChildResult] = visitor.visit(rightChild);
    const leftChildTemporal = leftChildResult.getTemporal();
    const rightChildTemporal = rightChildResult.getTemporal();
    const temporal = new TemporalValue();
    return [leftChildTemporal, rightChildTemporal, temporal];
}