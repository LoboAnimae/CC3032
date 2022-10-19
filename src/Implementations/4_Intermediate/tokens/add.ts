import { IntType } from "../..";
import { AddContext } from "../../../antlr/yaplParser";
import { basicOperation, Add } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";

export default function (visitor: MemoryVisitor, ctx: AddContext): IMemoryVisitor[] {
  const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
  visitor.addQuadruple(new Add({ saveIn: temporal, operand1: leftChildTemporal, operand2: rightChildTemporal }));
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
