import { AddContext } from "../../../antlr/yaplParser";
import IntType from "../../Generics/Integer.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import basicOperation from "./Instructions/BasicOperation";
import { Add } from "./Instructions/Operation";

export default function (visitor: MemoryVisitor, ctx: AddContext): IMemoryVisitor[] {
    const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
    visitor.addQuadruple(new Add({ saveIn: temporal, operand1: leftChildTemporal, operand2: rightChildTemporal }));
    const size = IntType.Size;
    const getTemporal = () => temporal;
    return [{ size, getTemporal }];
}