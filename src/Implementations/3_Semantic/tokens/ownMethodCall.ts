import { MethodElement, Primitive, SymbolElement } from '../../';
import { OwnMethodCallContext } from '../../../antlr/yaplParser';
import { CompositionComponent, extractBasicInformation, extractTableComponent, extractTypeComponent, TypeComponent } from '../../../Components';
import { YaplVisitor } from '../visitor';

export function visitOwnMethodCall(visitor: YaplVisitor, ctx: OwnMethodCallContext): Primitive[] {
  const methodIdentifier = ctx.IDENTIFIER();
  const [...methodParametersRaw] = ctx.expression();

  const methodParameters: Primitive[] = methodParametersRaw.flatMap((p) => visitor.visit(p)) as Primitive[];

  const methodHoldingClass: MethodElement = visitor.getCurrentScope();
  const methodHoldingClassTable = extractTableComponent<MethodElement | SymbolElement>(methodHoldingClass)!;
  const referencedMethod = methodHoldingClassTable.get(methodIdentifier)! as MethodElement;

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
      `Incorrect number of parameters for method ${methodIdentifier.toString()} from class ${methodHoldingClassName} (expected ${requiredMethodParameters.length
      }, got ${methodParameters.length})`,
    );
    return visitor.next(ctx);
  }

  for (let i = 0; i < requiredMethodParameters.length; i++) {
    const requiredParameterType: TypeComponent = extractTypeComponent(requiredMethodParameters[i])!;
    const methodParameterType: Primitive = methodParameters[i];
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
  const referencedMethodType = extractTypeComponent(referencedMethod)!;
  return [referencedMethodType as Primitive];
}
