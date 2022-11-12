import { MethodElement, SymbolElement } from "Implementations";
import { MethodContext } from "../../../antlr/yaplParser";
import { extractTableComponent, TemporalValue, V0 } from "../../../Components";
import { MethodDeclaration, Move } from "../Instructions";
import { MemoryVisitor, IMemoryVisitor } from "../visitor";


export default function (visitor: MemoryVisitor, ctx: MethodContext): IMemoryVisitor[] {
  const name = ctx.IDENTIFIER();
  const currentClassName = visitor.currentClass().getName();
  const currentClassTable = visitor.currentClassTable();
  const expectedName = `${currentClassName}::${name.text}()`;
  const method: MethodElement = currentClassTable.get(name.text)! as MethodElement;
  // @ts-ignore
  visitor.classStack.push(method);
  visitor.pushScope(expectedName);
  visitor.addQuadruple(new MethodDeclaration(expectedName));
  let currentStackOffset = method.size;
  for (const formal of extractTableComponent(method)!.getAll()) {
    currentStackOffset -= (formal as SymbolElement).getSize();
    (formal as SymbolElement).setMemoryAddress(currentStackOffset);
  }
  const children = visitor.visitChildren(ctx);
  const lastChild = children.at(-1)!;
  visitor.writeReturn(lastChild.getTemporal());
  visitor.popScope();
  visitor.classStack.pop();

  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: new V0() }));

  const size = 0;
  const getTemporal = () => temporal;

  return [{ size, getTemporal }];
}
