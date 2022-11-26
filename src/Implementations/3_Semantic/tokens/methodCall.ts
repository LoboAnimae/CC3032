import { ClassType, ErrorType, MethodElement, Primitive, TableElementType } from '../../';
import { MethodCallContext } from '../../../antlr/yaplParser';
import { CompositionComponent, EmptyComponent, extractTableComponent, extractTypeComponent } from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitMethodCall(visitor: YaplVisitor, ctx: MethodCallContext): Primitive[] {
  const [calledVariable, ...parameters] = ctx.expression();
  const methodName = ctx.IDENTIFIER();
  const methodType = ctx.TYPE();

  const callingClass = visitor.getCurrentScope();
  const callingClassTable = extractTableComponent<TableElementType>(callingClass)!;
  const callingVariable = callingClassTable.get(calledVariable.text);


  let referencedClass = extractTypeComponent(callingVariable)! as ClassType;

  const referencedClassTable = extractTableComponent(referencedClass);
  let referencedMethod = referencedClassTable?.get(methodName.text) as MethodElement;
  let referencedMethodType = extractTypeComponent(referencedMethod) as Primitive;

  if (methodType && methodType.text !== (referencedClass.getName?.() ?? referencedClass.componentName)) {
    const referencedMethodParentClass = visitor.findTable(methodType);
    if (!referencedMethodParentClass) {
      const message = `${Color.class('Class')} ${Color.class(methodType.text)} does ${Color.error('not')} exist`;
      visitor.addError(ctx, message);
      return [new ErrorType()];
    }
    const hasAccessTo = referencedClass.inheritsFrom(referencedMethodParentClass);
    if (!hasAccessTo) {
      const message = `Method ${Color.scope(methodName.text)} from ${Color.class(`class ${referencedMethodParentClass.getName()}`)} is ${Color.error('not accessible')} to ${Color.class('class')} ${Color.class(callingClass.getName?.() ?? callingClass.componentName)}`;
      visitor.addError(ctx, message);
    }
    const referencedMethodParentClassTable = extractTableComponent(referencedMethodParentClass);
    referencedMethod = referencedMethodParentClassTable?.get(methodName.text) as MethodElement;
    referencedMethodType = extractTypeComponent(referencedMethod) as Primitive;
  }

  if (!referencedMethod) {
    visitor.addError(ctx, `Method '${Color.scope(methodName.text)}' is not defined in class '${Color.class(methodType?.text ?? referencedClass?.componentName)}'`);
    return [new ErrorType()];
  }

  const paramNum = parameters.length;
  const requiredParams = extractTableComponent(referencedMethod)!.getAll();
  const requiredParamsNum = requiredParams.length;
  if (paramNum !== requiredParamsNum) {
    visitor.addError(ctx, `${Color.error('Incorrect number of parameters')} (expected ${requiredParamsNum} but found ${paramNum})`);
    return visitor.next(ctx);
  }
  for (let i = 0; i < paramNum; ++i) {
    const [param] = visitor.visit(parameters[i]);
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

  return [referencedMethodType!];
}
