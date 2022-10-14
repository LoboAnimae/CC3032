import { DivisionContext } from "../../../antlr/yaplParser";
import IntType from "../../Generics/Integer.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import basicOperation from "./Instructions/BasicOperation";
import { Div } from "./Instructions/Operation";

export default function visitDivision(visitor: MemoryVisitor, ctx: DivisionContext): IMemoryVisitor[] {
    const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
    visitor.addQuadruple(new Div({
        saveIn: temporal,
        operand1: leftChildTemporal,
        operand2: rightChildTemporal
    }));
    const size = IntType.Size;
    const getTemporal = () => temporal;
    return [{ size, getTemporal }];
}