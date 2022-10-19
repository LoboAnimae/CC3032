import { lineAndColumn } from '../';
import { ClassType, MethodElement, Primitive, SymbolElement, TableElementType } from '../../';
import { MethodContext } from '../../../antlr/yaplParser';
import { CompositionComponent, ContextHolder, extractTableComponent, extractTypeComponent } from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitMethod(visitor: YaplVisitor, ctx: MethodContext): Primitive[] {
  const methodName = ctx.IDENTIFIER().text;
  const methodExpectedType = ctx.TYPE();
  const methodBody = ctx.expression();

  const methodTable: ClassType | MethodElement | null =
    methodExpectedType.text === 'SELF_TYPE' ? visitor.getCurrentScope() : visitor.findTable(methodExpectedType);
  const methodType = extractTypeComponent(methodTable) as Primitive;

  // ERROR: The method type is not yet defined (if ever)
  if (!methodType) {
    visitor.addError(ctx, `Method type ${methodExpectedType.toString()} is not defined`);
    return visitor.next(ctx);
  }

  const newMethod = new MethodElement({
    name: methodName,
    type: methodType,
    scopeName: visitor.getCurrentScope().getName() ?? 'Unknown name',
    ...lineAndColumn(ctx),
    memoryAddress: -1,
  });
  const methodContext = newMethod.getComponent<ContextHolder<MethodContext>>({ componentType: ContextHolder.Type });
  methodContext?.setContext(ctx);

  const currentTable: ClassType = visitor.getCurrentScope();
  const classTableComponent = extractTableComponent<TableElementType>(currentTable)!;

  const methodTableComponent = extractTableComponent<TableElementType>(newMethod)!;
  methodTableComponent.parent = classTableComponent;
  visitor.scopeStack.push(newMethod);

  // If it doesn't exist, it is a syntax error
  const formalParameters = ctx.formal();
  for (const param of formalParameters) {
    visitor.visit(param);
    // newMethod.addParameters(newParam);
  }

  const [expressionResult] = visitor.visit(methodBody);
  const expressionType = extractTypeComponent(expressionResult);

  // ERROR: If the expression is not valid, an empty component is returned, and no type will be found
  if (!expressionType) {
    visitor.addError(ctx, `Expected expression to return '${methodExpectedType.text}' inside method '${methodName}'`);
    return visitor.next(ctx);
  }

  const canBeAssigned = methodType.allowsAssignmentOf(expressionType);
  // ERROR: Last child and return type do not match or can't be assigned
  if (!canBeAssigned) {
    const message = `Cannot assign ${Color.class(expressionType.componentName)} to method of type ${Color.class(methodType.componentName)}`;
    visitor.addError(ctx, message);
  }

  visitor.scopeStack.pop();
  classTableComponent.add(newMethod);
  return [methodType];
}
