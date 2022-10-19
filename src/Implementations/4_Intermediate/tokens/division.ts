import { IntType } from "../..";
import { DivisionContext } from "../../../antlr/yaplParser";
import { basicOperation, Div } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function visitDivision(visitor: MemoryVisitor, ctx: DivisionContext): IMemoryVisitor[] {
  const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
  visitor.addQuadruple(
    new Div({
      saveIn: temporal,
      operand1: leftChildTemporal,
      operand2: rightChildTemporal,
    }),
  );
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
