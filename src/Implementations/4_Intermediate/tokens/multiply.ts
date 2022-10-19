import { IntType } from "../..";
import { MultiplyContext } from "../../../antlr/yaplParser";
import { basicOperation, Mult } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: MultiplyContext): IMemoryVisitor[] {
  const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
  visitor.addQuadruple(
    new Mult({
      saveIn: temporal,
      operand1: leftChildTemporal,
      operand2: rightChildTemporal,
    }),
  );
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
