import { TrueContext } from "../antlr/yaplParser";
import BoolType from "../../Generics/Boolean.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import { Move } from "./Instructions/MemoryManagement";
import { TemporalValue } from "./TemporaryValues";

export default function (visitor: MemoryVisitor, ctx: TrueContext): IMemoryVisitor[] {
    const size = BoolType.Size;
    const temporal = new TemporalValue();
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: 1 }));
    const getTemporal = () => temporal;
    return [{ size, getTemporal }];
}