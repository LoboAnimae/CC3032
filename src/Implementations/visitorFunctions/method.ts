import { MethodContext } from '../../antlr/yaplParser';
import { YaplVisitor } from '../../yaplVisitor';
import CompositionComponent from '../Components/Composition';
import ContextHolder from '../Components/ContextHolder';
import { extractTableComponent } from '../Components/Table';
import { extractTypeComponent } from '../Components/Type';
import { extractValueComponent } from '../Components/ValueHolder';
import { TableElementType } from '../DataStructures/TableElements/index';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import { ClassType } from '../Generics/Object.type';
import { lineAndColumn } from './meta';

export default function visitMethod(visitor: YaplVisitor, ctx: MethodContext) {
  const methodName = ctx.IDENTIFIER().text;
  const methodExpectedType = ctx.TYPE();
  const methodBody = ctx.expression();

  const methodTable: ClassType | MethodElement | null =
    methodExpectedType.text === 'SELF_TYPE' ? visitor.getCurrentScope() : visitor.findTable(methodExpectedType);
  const methodType = extractTypeComponent(methodTable);

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
    const newParam = visitor.visit(param);
    newMethod.addParameters(newParam);
  }

  const expressionResultRaw: CompositionComponent = visitor.visit(methodBody);
  const expressionResult = Array.isArray(expressionResultRaw) ? expressionResultRaw[0] : expressionResultRaw;
  const expressionType = extractTypeComponent(expressionResult);

  // ERROR: If the expression is not valid, an empty component is returned, and no type will be found
  if (!expressionType) {
    visitor.addError(ctx, `Expected expression to return '${methodExpectedType.text}' inside method '${methodName}'`);
    return visitor.next(ctx);
  }

  const canBeAssigned = methodType.allowsAssignmentOf(expressionType);
  // ERROR: Last child and return type do not match or can't be assigned
  if (!canBeAssigned) {
    visitor.addError(
      ctx,
      `Cannot assign ${expressionType.componentName} to method of type ${methodType.componentName}`,
    );
    return visitor.next(ctx);
  }

  visitor.scopeStack.pop();
  classTableComponent.add(newMethod);
  return methodType;
}
