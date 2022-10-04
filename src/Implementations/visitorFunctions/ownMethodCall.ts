import { OwnMethodCallContext } from '../../antlr/yaplParser';
import { extractBasicInformation } from '../Components/BasicInformation';
import { extractTableComponent } from '../Components/Table';
import TypeComponent, { extractTypeComponent } from '../Components/Type';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { YaplVisitor } from './meta';

export default function visitOwnMethodCall(visitor: YaplVisitor, ctx: OwnMethodCallContext) {
  const methodIdentifier = ctx.IDENTIFIER();
  const [...methodParametersRaw] = ctx.expression();

  const methodParameters: SymbolElement[] = methodParametersRaw.map((p) => visitor.visit(p));

  const methodHoldingClass: MethodElement = visitor.getCurrentScope();
  const methodHoldingClassTable = extractTableComponent<SymbolElement>(methodHoldingClass)!;
  const referencedMethod: MethodElement = methodHoldingClassTable.get(methodIdentifier) as MethodElement;

  // ERROR: The method does not exist in the class (self or not)
  if (!referencedMethod) {
    const methodHoldingClassName = extractBasicInformation(methodHoldingClassTable)?.getName();
    visitor.addError(
      ctx,
      `Attempting to call non-existing method ${methodIdentifier.toString()} from class ${methodHoldingClassName}`,
    );
    return visitor.next(ctx);
  }

  const requiredMethodParameters: SymbolElement[] = referencedMethod.getParameters();
  const sameNumberOfParameters = requiredMethodParameters.length === methodParameters.length;

  // ERROR: The method is called with a different number of parameters than it requires
  if (!sameNumberOfParameters) {
    const methodHoldingClassName = extractBasicInformation(methodHoldingClassTable)?.getName();
    visitor.addError(
      ctx,
      `Incorrect number of parameters for method ${methodIdentifier.toString()} from class ${methodHoldingClassName} (expected ${
        requiredMethodParameters.length
      }, got ${methodParameters.length})`,
    );
    return visitor.next(ctx);
  }

  for (let i = 0; i < requiredMethodParameters.length; i++) {
    const requiredParameterType: TypeComponent = extractTypeComponent(requiredMethodParameters[i])!;
    const methodParameterType: SymbolElement = methodParameters[i];
    const allowed = requiredParameterType.allowsAssignmentOf(methodParameterType);
    // ERROR: The parameter required is not the same as the one passed
    if (!allowed) {
      visitor.addError(
        ctx,
        `Incorrect type of parameter ${requiredMethodParameters[
          i
        ].getName()} for method ${methodIdentifier.toString()} from class ${methodHoldingClass.getName()}`,
      );
    }
  }
  return referencedMethod;
}
