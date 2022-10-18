import { ClassDefineContext, LetInContext } from 'antlr/yaplParser';
import { extractTableComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { MethodElement } from 'Implementations/DataStructures/TableElements';
import { ClassType } from 'Implementations/Generics';

export function visitLetIn(visitor: YaplVisitor, ctx: LetInContext) {
  const methodComponent = new MethodElement({
    scopeName: 'letIn',
    name: 'leIn',
    type: new ClassType({ name: 'letIn', context: ctx as unknown as ClassDefineContext }),
  });
  extractTableComponent<ClassType | MethodElement>(methodComponent)!.parent = visitor.getCurrentScope();
  visitor.scopeStack.push(methodComponent);
  ctx.assignmentExpr().forEach(visitor.visit);
  const expression = ctx.expression();
  const result = visitor.visit(expression);
  visitor.scopeStack.pop();
  return result;
}
