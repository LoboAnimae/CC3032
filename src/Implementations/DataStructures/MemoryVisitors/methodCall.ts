import { MethodCallContext } from '../../../antlr/yaplParser';
import { extractContext } from '../../Components/ContextHolder';
import TableComponent, { extractTableComponent } from '../../Components/Table';
import { extractTypeComponent } from '../../Components/Type';
import { ClassType } from '../../Generics/Object.type';
import { IMemoryVisitor, MemoryVisitor } from '../Memory';
import MethodElement from '../TableElements/MethodElement';
import SymbolElement from '../TableElements/SymbolElement';
import { LinkedJump } from './Instructions/Jumps';
import { LoadWord, MemoryAddress, Move, StoreWord } from './Instructions/MemoryManagement';
import { MethodDeclaration, Return } from './Instructions/Misc';
import { OBJECT_POINTER, STACK_POINTER, TemporalValue, V0 } from './TemporaryValues';

export default function (visitor: MemoryVisitor, ctx: MethodCallContext): IMemoryVisitor[] {
  visitor.startCall();
  const name = ctx.IDENTIFIER();
  const type = ctx.TYPE();
  const [callingVariable, ...parameters] = ctx.expression();
  const currentClassTable = visitor.currentClassTable(-1);
  const callingVariableSymbol = visitor.findInStack(callingVariable.text);
  //   const callingVariableSymbol = currentClassTable.get(callingVariable.text) as SymbolElement;
  const variableType = type
    ? (visitor.symbolsTable.get(type)!.copy()! as ClassType)
    : (extractTypeComponent(callingVariableSymbol)! as ClassType);

  let variableTable: TableComponent<MethodElement | SymbolElement>;
  if (type) {
    const inheritedTable = extractTableComponent<MethodElement | SymbolElement>(
      visitor.symbolsTable.get(type)! as ClassType,
    )!
      .copy()!
      // @ts-ignore
      .getAll(false) as (SymbolElement | MethodElement)[];
    const currentTable = extractTableComponent(callingVariableSymbol)!.getAll(false) as (
      | SymbolElement
      | MethodElement
    )[];

    variableTable = new TableComponent<MethodElement | SymbolElement>();
    variableTable.add(...inheritedTable.filter((t) => t.componentName === MethodElement.Name));
    variableTable.add(...currentTable.filter((t) => t.componentName === SymbolElement.Name));
  } else {
    variableTable = extractTableComponent(callingVariableSymbol) as TableComponent<MethodElement | SymbolElement>;
  }
  visitor.classStack.push(callingVariableSymbol);
  const expectedMethodName = `${variableType.getName()}::${name.text}`;

  let totalMemory = 0;
  const addresses = [];
  for (const parameter of parameters) {
    const referenced = currentClassTable.get(parameter.text)! as SymbolElement;
    totalMemory += referenced.getSize();
    addresses.push({
      base: callingVariableSymbol!.getMemoryAddress(),
      address: referenced.memoryAddress,
      size: referenced.getSize(),
    });
  }

  let nextPointer = 0;
  visitor.AskForStackMemory(totalMemory);
  const temporals = [];
  for (const address of addresses) {
    const currentStackPointer = visitor.stackMemoryOffset;
    const memoryAddress = address.base + address.address;
    const temporal = new TemporalValue();
    temporals.push(temporal);
    const memoryTemporal = new MemoryAddress(memoryAddress);
    visitor.addQuadruple(
      new LoadWord({
        dataMovesFrom: memoryTemporal,
        dataMovesInto: temporal,
      }),
    );
    visitor.addQuadruple(
      new StoreWord({
        dataMovesFrom: temporal,
        dataMovesInto: new STACK_POINTER(currentStackPointer - nextPointer),
      }),
    );
    nextPointer = currentStackPointer + address.size;
    // visitor.addQuadruple()
  }

  visitor.addQuadruple(new LinkedJump(expectedMethodName));

  const method = visitor.methods[expectedMethodName];
  if (!method) {
    visitor.pushScope(expectedMethodName);
    visitor.addQuadruple(new MethodDeclaration(expectedMethodName));
    const stackBefore = visitor.stackMemoryOffset;
    const foundMethod = variableTable!.get(name.text)!;
    const methodContext = extractContext(foundMethod)!;
    // @ts-ignore
    visitor.classStack.push(foundMethod);
    const newMethod = visitor.visitChildren(methodContext.context!);
    visitor.classStack.pop();
    visitor.removeFromStack(stackBefore - visitor.stackMemoryOffset);
    visitor.stackMemoryOffset = stackBefore;
    let nextPointer2 = 0;
    let temporalPointer = 0;
    for (const address of addresses) {
      const temporal = temporals[temporalPointer++];
      const currentStackPointer = visitor.stackMemoryOffset;
      const memoryAddress = address.base + address.address;
      visitor.addQuadruple(
        new LoadWord({
          dataMovesFrom: new STACK_POINTER(currentStackPointer - nextPointer2),
          dataMovesInto: temporal,
        }),
      );
      nextPointer2 = currentStackPointer + address.size;

      // visitor.addQuadruple()
    }
    visitor.LiberateStackMemory(totalMemory);
    visitor.writeReturn(newMethod.at(-1)!.getTemporal());
    visitor.popScope();
  }
  visitor.endCall();
  const temporal = new TemporalValue();
  visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: new V0() }));
  visitor.classStack.pop();
  // TODO: Remove the parameters from the stack
  return [{ size: 0, getTemporal: () => temporal }];
}
