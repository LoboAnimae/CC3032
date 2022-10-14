import { NewContext } from "../../../antlr/yaplParser";
import { ClassType } from "../../Generics/Object.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import { Move } from "./Instructions/MemoryManagement";
import { TemporalValue, V0 } from "./TemporaryValues";

export default function (visitor: MemoryVisitor, ctx: NewContext): IMemoryVisitor[] {
    const type = ctx.TYPE();
    const temporal = new TemporalValue();
    const referencedType = visitor.symbolsTable.get(type.text)! as ClassType;
    const size = referencedType.getSize();
    visitor.AskForHeapMemory(size);
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: new V0() }));
    return [{ size, getTemporal: () => temporal }];
};

