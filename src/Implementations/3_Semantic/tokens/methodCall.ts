import { MethodCallContext } from 'antlr/yaplParser';
import { EmptyComponent, extractTableComponent, extractTypeComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { MethodElement, TableElementType } from 'Implementations/DataStructures/TableElements';
import { ClassType } from 'Implementations/Generics';

export function visitMethodCall(visitor: YaplVisitor, ctx: MethodCallContext) {
  const [calledVariable, ...parameters] = ctx.expression();
  const methodName = ctx.IDENTIFIER();
  const methodType = ctx.TYPE();

  const callingClass = visitor.getCurrentScope();
  const callingClassTable = extractTableComponent<TableElementType>(callingClass)!;
  const callingVariable = callingClassTable.get(calledVariable.text);

  const referencedClass = extractTypeComponent(callingVariable)! as ClassType;
  const referencedClassTable = extractTableComponent(referencedClass);
  let referencedMethod = referencedClassTable?.get(methodName.text) as MethodElement;
  let referencedMethodType = extractTypeComponent(referencedMethod);

  if (methodType && methodType.text !== referencedClass.getName()) {
    const referencedMethodParentClass = visitor.findTable(methodType);
    if (!referencedMethodParentClass) {
      visitor.addError(ctx, `Class '${methodType.text}' is not defined`);
      return new EmptyComponent();
    }
    const hasAccessTo = referencedClass.inheritsFrom(referencedMethodParentClass);
    if (!hasAccessTo) {
      visitor.addError(ctx, `Method ${methodName.text} is not accessible to class ${methodType.text}`);
      return new EmptyComponent();
    }
    const referencedMethodParentClassTable = extractTableComponent(referencedMethodParentClass);
    referencedMethod = referencedMethodParentClassTable?.get(methodName.text) as MethodElement;
    referencedMethodType = extractTypeComponent(referencedMethod);
  }

  if (!referencedMethod) {
    visitor.addError(ctx, `Method '${methodName.text}' is not defined in class '${referencedClass.getName()}'`);
    return new EmptyComponent();
  }

  const paramNum = parameters.length;
  const requiredParams = extractTableComponent(referencedMethod)!.getAll();
  const requiredParamsNum = requiredParams.length;
  if (paramNum !== requiredParamsNum) {
    visitor.addError(ctx, `Incorrect number of parameters (expected ${requiredParamsNum} but found ${paramNum})`);
    return visitor.next(ctx);
  }
  for (let i = 0; i < paramNum; ++i) {
    const param = visitor.visit(parameters[i]);
    const requiredParam = requiredParams[i];
    const givenParamType = extractTypeComponent(param);
    const requiredParamType = extractTypeComponent(requiredParam)!;
    if (!givenParamType) {
      visitor.addError(ctx, `Can't resolve type of ${parameters[i].text}`);
      continue;
    }
    if (!requiredParamType.allowsAssignmentOf(givenParamType)) {
      visitor.addError(ctx, `Can't assign parameter type`);
    }
  }

  return referencedMethodType;
}
