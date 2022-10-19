import { IntType } from "../..";
import { MinusContext } from "../../../antlr/yaplParser";
import { basicOperation, Sub } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: MinusContext): IMemoryVisitor[] {
  const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
  visitor.addQuadruple(
    new Sub({
      saveIn: temporal,
      operand1: leftChildTemporal,
      operand2: rightChildTemporal,
    }),
  );
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
