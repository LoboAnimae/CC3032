import { MethodCallContext } from "../../antlr/yaplParser";
import { extractTableComponent } from "../Components/Table";
import TypeComponent from "../Components/Type";
import MethodElement from "../DataStructures/TableElements/MethodElement";
import SymbolElement from "../DataStructures/TableElements/SymbolElement";
import { ClassType } from "../Generics/Object.type";
import { Scope, YaplVisitor } from "./meta";

export default function visitMethodCall(visitor: YaplVisitor, ctx: MethodCallContext) {
    const methodType = ctx.TYPE();
    const methodName = ctx.IDENTIFIER();
    const currentScope = visitor.getCurrentScope() as ClassType;
    const existingTable = visitor.findTable(methodType);
    const tableInScope = extractTableComponent(currentScope);


    const [variableName, ...methodParametersRaw] = ctx.expression();
    const methodParameters: SymbolElement[] = methodParametersRaw.map((p: any) => visitor.visit(p));
    const variable = visitor.visit(variableName);

    // ERROR: Variable is not defined
    if (!variable) {
        return visitor.next(ctx);
    }


    let methodHoldingClass: TypeComponent;

    if (variableName.text.toLocaleLowerCase() === 'self') {
        methodHoldingClass = currentScope;
    } else if (existingTable) {
        methodHoldingClass = existingTable;
    } else {
        const foundClassType = tableInScope?.get(variableName) as ClassType;
        methodHoldingClass = foundClassType?.getType();
    }



    // ERROR: The method holding the class does not exist
    if (!methodHoldingClass) {
        visitor.addError(
            ctx,
            `Attempting to call method from non-existing class (class ${ctx.TYPE()} does not exist or is not yet defined)`,
        );
        return visitor.next(ctx);
    }


    const allowsAssignment = methodHoldingClass?.allowsAssignmentOf(variable);

    // ERROR: A class is able to call only its own methods or it's parents methods
    // if (!allowsAssignment) {
    //     visitor.addError(
    //         ctx,
    //         // `Attempting to call method from class ${methodHoldingClass.tableName} from class ${variable.tableName}, but ${variable.tableName} is not a child of ${methodHoldingClass.tableName}`,
    //         `Can't call method ${methodName.toString()} from this class`
    //     );
    // }

    const methodHoldingClassTable = extractTableComponent(methodHoldingClass);
    const referencedMethod = methodHoldingClassTable?.get(methodName.text) as MethodElement;

    // ERROR: The method does not exist in the class (self or not)
    if (!referencedMethod) {
        visitor.addError(
            ctx,
            // `Attempting to call non-existing method ${calledMethod.text} from class ${methodHoldingClass.tableName}`,
            `Error in MethodCalls: No referenced method exists`
        );
        return visitor.next(ctx);
    }

    const requiredMethodParameters: SymbolElement[] = referencedMethod.getParameters() ?? [];
    const sameNumberOfParameters = requiredMethodParameters.length === methodParameters.length;

    // ERROR: The method is called with a different number of parameters than it requires
    if (!sameNumberOfParameters) {
        visitor.addError(
            ctx,
            // `Incorrect number of parameters for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredMethodParameters.length}, got ${methodParameters.length})`,
            `Incorrect number of parameters in method call`
        );
        return visitor.next(ctx);
    }

    for (let i = 0; i < requiredMethodParameters.length; i++) {
        const requiredParameterType = requiredMethodParameters[i].getType();
        const methodParameterType = methodParameters[i];
        const allowed = requiredParameterType.allowsAssignmentOf(methodParameterType);
        // ERROR: The parameter required is not the same as the one passed
        if (!allowed) {
            visitor.addError(
                ctx,
                // `Incorrect type of parameter ${requiredMethodParameters[i].name} for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredParameterType.tableName}, got ${methodParameterType.tableName})`,
                `Incorrect parameter type`
            );
        }
    }
    return referencedMethod.getType();
}