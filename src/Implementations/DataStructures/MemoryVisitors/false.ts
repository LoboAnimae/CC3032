import { FalseContext } from "../antlr/yaplParser";
import BoolType from "../../Generics/Boolean.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import { Move } from "./Instructions/MemoryManagement";
import { TemporalValue } from "./TemporaryValues";

export default function (visitor: MemoryVisitor, _ctx: FalseContext): IMemoryVisitor[] {
    const size = BoolType.Size;
    const temporal = new TemporalValue();
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: 0 }));
    const getTemporal = () => temporal;
    return [{ size, getTemporal }];
}