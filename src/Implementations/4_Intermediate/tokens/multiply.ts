import { MultiplyContext } from 'antlr/yaplParser';
import { basicOperation } from 'Implementations/4_Intermediate/Instructions/BasicOperation';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { IntType } from 'Implementations/Generics';
import { Mult } from 'Implementations/4_Intermediate/Instructions';

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
