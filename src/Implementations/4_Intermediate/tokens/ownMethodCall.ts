import { OwnMethodCallContext } from 'antlr/yaplParser';
import { TemporalValue } from 'Components';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { MethodElement } from 'Implementations/DataStructures/TableElements';

export default function (visitor: MemoryVisitor, ctx: OwnMethodCallContext): IMemoryVisitor[] {
  visitor.startCall();
  const name = ctx.IDENTIFIER();
  const parameters = ctx.expression();
  const currentClassTable = visitor.currentClassTable(-1);
  const currentClass = visitor.currentClass(-1);
  const method = currentClassTable.get(name.text) as MethodElement;
  const expectedMethodName = `${currentClass.getName()}::${name.text}`;

  //   let totalMemory = 0;
  //   const addresses = [];
  //   for (const parameter of parameters) {
  //     const referenced = currentClassTable.get(parameter.text)! as SymbolElement;
  //     totalMemory += referenced.getSize();
  //     addresses.push({
  //       base: callingVariableSymbol!.getMemoryAddress(),
  //       address: referenced.memoryAddress,
  //       size: referenced.getSize(),
  //     });
  //   }

  //   let nextPointer = 0;
  //   visitor.AskForStackMemory(totalMemory);
  //   const temporals = [];
  //   for (const address of addresses) {
  //     const currentStackPointer = visitor.stackMemoryOffset;
  //     const memoryAddress = address.base + address.address;
  //     const temporal = new TemporalValue();
  //     temporals.push(temporal);
  //     const memoryTemporal = new MemoryAddress(memoryAddress);
  //     visitor.addQuadruple(
  //       new LoadWord({
  //         dataMovesFrom: memoryTemporal,
  //         dataMovesInto: temporal,
  //       }),
  //     );
  //     visitor.addQuadruple(
  //       new StoreWord({
  //         dataMovesFrom: temporal,
  //         dataMovesInto: new STACK_POINTER(currentStackPointer - nextPointer),
  //       }),
  //     );
  //     nextPointer = currentStackPointer + address.size;
  //     // visitor.addQuadruple()
  //   }

  //   visitor.addQuadruple(new LinkedJump(expectedMethodName));
  //   const methodBody = visitor.methods[expectedMethodName];

  //   if (!methodBody) {
  //     // visitor.pushScope(expectedMethodName);
  //     // visitor.addQuadruple(new MethodDeclaration(expectedMethodName));

  //     visitor.pushScope(expectedMethodName);
  //     visitor.addQuadruple(new MethodDeclaration(expectedMethodName));
  //     const stackBefore = visitor.stackMemoryOffset;
  //     const methodContext = extractContext(method)!;
  //     // @ts-ignore
  //     visitor.classStack.push(foundMethod);
  //     const newMethod = visitor.visitChildren(methodContext.context!);
  //     visitor.classStack.pop();
  //     visitor.removeFromStack(stackBefore - visitor.stackMemoryOffset);
  //     visitor.stackMemoryOffset = stackBefore;
  //     let nextPointer2 = 0;
  //     let temporalPointer = 0;
  //     for (const address of addresses) {
  //       const temporal = temporals[temporalPointer++];
  //       const currentStackPointer = visitor.stackMemoryOffset;
  //       const memoryAddress = address.base + address.address;
  //       visitor.addQuadruple(
  //         new LoadWord({
  //           dataMovesFrom: new STACK_POINTER(currentStackPointer - nextPointer2),
  //           dataMovesInto: temporal,
  //         }),
  //       );
  //       nextPointer2 = currentStackPointer + address.size;

  //       // visitor.addQuadruple()
  //     }
  //     visitor.LiberateStackMemory(totalMemory);
  //     visitor.writeReturn(newMethod.at(-1)!.getTemporal());
  //     visitor.popScope();
  //   }
  //   const callingVariableSymbol = currentClassTable.get(callingVariable.text) as SymbolElement;
  //   const variableType = extractTypeComponent(callingVariableSymbol)! as ClassType;

  //   let variableTable: TableComponent<MethodElement | SymbolElement>;
  //   visitor.classStack.push(callingVariableSymbol);
  //   const expectedMethodName = `${variableType.getName()}::${name.text}`;

  //   let totalMemory = 0;
  //   const addresses = [];
  //   for (const parameter of parameters) {
  //     const referenced = currentClassTable.get(parameter.text)! as SymbolElement;
  //     totalMemory += referenced.getSize();
  //     addresses.push({
  //       base: callingVariableSymbol!.getMemoryAddress(),
  //       address: referenced.memoryAddress,
  //       size: referenced.getSize(),
  //     });
  //   }

  //   let nextPointer = 0;
  //   visitor.AskForStackMemory(totalMemory);
  //   const temporals = [];
  //   for (const address of addresses) {
  //     const currentStackPointer = visitor.stackMemoryOffset;
  //     const memoryAddress = address.base + address.address;
  //     const temporal = new TemporalValue();
  //     temporals.push(temporal);
  //     const memoryTemporal = new MemoryAddress(memoryAddress);
  //     visitor.addQuadruple(
  //       new LoadWord({
  //         dataMovesFrom: memoryTemporal,
  //         dataMovesInto: temporal,
  //       }),
  //     );
  //     visitor.addQuadruple(
  //       new StoreWord({
  //         dataMovesFrom: temporal,
  //         dataMovesInto: new STACK_POINTER(currentStackPointer - nextPointer),
  //       }),
  //     );
  //     nextPointer = currentStackPointer + address.size;
  //     // visitor.addQuadruple()
  //   }

  //   visitor.addQuadruple(new LinkedJump(expectedMethodName));

  //   const method = visitor.methods[expectedMethodName];
  //   if (!method) {
  //     visitor.pushScope(expectedMethodName);
  //     visitor.addQuadruple(new MethodDeclaration(expectedMethodName));
  //     const stackBefore = visitor.stackMemoryOffset;
  //     const foundMethod = variableTable!.get(name.text)!;
  //     const methodContext = extractContext(foundMethod)!;
  //     // @ts-ignore
  //     visitor.classStack.push(foundMethod);
  //     const newMethod = visitor.visitChildren(methodContext.context!);
  //     visitor.classStack.pop();
  //     visitor.removeFromStack(stackBefore - visitor.stackMemoryOffset);
  //     visitor.stackMemoryOffset = stackBefore;
  //     let nextPointer2 = 0;
  //     let temporalPointer = 0;
  //     for (const address of addresses) {
  //       const temporal = temporals[temporalPointer++];
  //       const currentStackPointer = visitor.stackMemoryOffset;
  //       const memoryAddress = address.base + address.address;
  //       visitor.addQuadruple(
  //         new LoadWord({
  //           dataMovesFrom: new STACK_POINTER(currentStackPointer - nextPointer2),
  //           dataMovesInto: temporal,
  //         }),
  //       );
  //       nextPointer2 = currentStackPointer + address.size;

  //       // visitor.addQuadruple()
  //     }
  //     visitor.LiberateStackMemory(totalMemory);
  //     visitor.writeReturn(newMethod.at(-1)!.getTemporal());
  //     visitor.popScope();
  //   }
  //   visitor.endCall();
  //   const temporal = new TemporalValue();
  //   visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: new V0() }));
  //   visitor.classStack.pop();
  // TODO: Remove the parameters from the stack
  return [{ size: 0, getTemporal: () => new TemporalValue() }];
  //   return [{ size: 0, getTemporal: () => temporal }];
}
