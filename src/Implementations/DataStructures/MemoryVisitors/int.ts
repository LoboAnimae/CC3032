import { IntContext } from "../../../antlr/yaplParser";
import IntType from "../../Generics/Integer.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import { Move } from "./Instructions/MemoryManagement";
import { TemporalValue } from "./TemporaryValues";

export default function (visitor: MemoryVisitor, ctx: IntContext): IMemoryVisitor[] {
    const temporal = new TemporalValue();
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: parseInt(ctx.INT().text) }));
    const size = IntType.Size;
    const getTemporal = () => temporal;
    return [{ size, getTemporal }];
}