import { ClassType, MethodElement, Primitive } from '../../';
import { ClassDefineContext, LetInContext } from '../../../antlr/yaplParser';
import { extractTableComponent } from '../../../Components';
import { YaplVisitor } from '../visitor';

export function visitLetIn(visitor: YaplVisitor, ctx: LetInContext): Primitive[] {
  const methodComponent = new MethodElement({
    scopeName: 'letIn',
    name: 'leIn',
    type: new ClassType({ name: 'letIn', context: ctx as unknown as ClassDefineContext }),
  });
  extractTableComponent<ClassType | MethodElement>(methodComponent)!.parent = visitor.getCurrentScope();
  visitor.scopeStack.push(methodComponent);
  const allExpressions = ctx.assignmentExpr();
  for (const expr of allExpressions) {
    visitor.visit(expr);
  }
  const expression = ctx.expression();
  const result = visitor.visit(expression);
  visitor.scopeStack.pop();
  return result;
}
