import { MethodCallContext } from "../../../antlr/yaplParser";
import { extractContext } from "../../Components/ContextHolder";
import { extractTableComponent } from "../../Components/Table";
import { extractTypeComponent } from "../../Components/Type";
import { ClassType } from "../../Generics/Object.type";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import SymbolElement from "../TableElements/SymbolElement";
import { LinkedJump } from "./Instructions/Jumps";
import { LoadWord, MemoryAddress, Move, StoreWord } from "./Instructions/MemoryManagement";
import { MethodDeclaration, Return } from "./Instructions/Misc";
import { OBJECT_POINTER, STACK_POINTER, TemporalValue, V0 } from "./TemporaryValues";

export default function (visitor: MemoryVisitor, ctx: MethodCallContext): IMemoryVisitor[] {

    visitor.startCall();
    const name = ctx.IDENTIFIER();
    const [callingVariable, ...parameters] = ctx.expression();
    const currentClassTable = visitor.currentClassTable();
    const callingVariableSymbol = currentClassTable.get(callingVariable.text) as SymbolElement;
    const variableType = extractTypeComponent(callingVariableSymbol)! as ClassType;
    visitor.classStack.push(variableType);
    const variableTable = extractTableComponent(callingVariableSymbol);
    const expectedMethodName = `${variableType.getName()}::${name.text}()`;

    let totalMemory = 0;
    const addresses = [];
    for (const parameter of parameters) {
        const referenced = currentClassTable.get(parameter.text)! as SymbolElement;
        totalMemory += referenced.getSize();
        addresses.push({ base: callingVariableSymbol!.getMemoryAddress(), address: referenced.memoryAddress, size: referenced.getSize() });

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
        visitor.addQuadruple(new LoadWord({
            dataMovesFrom: memoryTemporal,
            dataMovesInto: temporal,
        }));
        visitor.addQuadruple(new StoreWord(
            {
                dataMovesFrom: temporal,
                dataMovesInto: new STACK_POINTER(currentStackPointer - nextPointer),
            }
        ));
        nextPointer = currentStackPointer + address.size;
        // visitor.addQuadruple()
    }


    visitor.addQuadruple(new LinkedJump(expectedMethodName));



    const method = visitor.methods[expectedMethodName];
    if (!method) {
        visitor.pushScope(expectedMethodName);
        visitor.addQuadruple(new MethodDeclaration(expectedMethodName));
        const stackBefore = visitor.stackMemoryOffset;
        const method = variableTable!.get(name.text)!;
        const methodContext = extractContext(method)!;
        visitor.classStack.push(method as ClassType);
        const newMethod = visitor.visitChildren(methodContext.context!);
        visitor.classStack.pop();
        visitor.removeFromStack(stackBefore - visitor.stackMemoryOffset);
        visitor.stackMemoryOffset = stackBefore;
        visitor.writeReturn(newMethod.at(-1)!.getTemporal());
        let nextPointer2 = 0;
        let temporalPointer = 0;
        for (const address of addresses) {
            const temporal = temporals[temporalPointer++];
            const currentStackPointer = visitor.stackMemoryOffset;
            const memoryAddress = address.base + address.address;
            visitor.addQuadruple(new LoadWord(
                {
                    dataMovesFrom: new STACK_POINTER(currentStackPointer - nextPointer2),
                    dataMovesInto: temporal,
                }
            ));
            nextPointer2 = currentStackPointer + address.size;

            // visitor.addQuadruple()
        }
        visitor.LiberateStackMemory(totalMemory);
        visitor.addQuadruple(new Return());
        visitor.popScope();
    }
    visitor.endCall();
    const temporal = new TemporalValue();
    visitor.addQuadruple(new Move({ dataMovesInto: temporal, dataMovesFrom: new V0() }));
    // TODO: Remove the parameters from the stack
    return [{ size: 0, getTemporal: () => temporal }];
}