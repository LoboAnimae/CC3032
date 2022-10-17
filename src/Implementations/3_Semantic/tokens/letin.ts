import { ClassDefineContext, LetInContext } from 'antlr/yaplParser';
import { YaplVisitor } from '../../yaplVisitor';
import TableComponent, { extractTableComponent } from 'Components'
import MethodElement from '../DataStructures/TableElements/MethodElement';
import { ClassType } from '../Generics/Object.type';

export default function visitLetIn(visitor: YaplVisitor, ctx: LetInContext) {
  // const assignment = ctx.ASSIGNMENT();
  // const expressions = ctx.expression().slice(0, -1);
  // const expression = ctx.expression().slice(-1)
  // const identifiers = ctx.IDENTIFIER();
  // const expressionsRaw = ctx.expression();
  // visitor.visit(identifiers[0])
  // // const assignments =
  const methodComponent = new MethodElement({
    scopeName: 'letIn',
    name: 'leIn',
    type: new ClassType({ name: 'letIn', context: ctx as unknown as ClassDefineContext }),
  });
  extractTableComponent<ClassType | MethodElement>(methodComponent)!.parent = visitor.getCurrentScope();
  visitor.scopeStack.push(methodComponent);
  const assignments = ctx.assignmentExpr();
  const expression = ctx.expression();
  for (const assignment of assignments) {
    const result = visitor.visit(assignment);
  }
  const result = visitor.visit(expression);
  visitor.scopeStack.pop();
  return result;
  // for (const identifier of identifiers) {

  // const result = visitor.visit()
  // }
}
