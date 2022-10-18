import { LessEqualContext } from 'antlr/yaplParser';
import { EmptyComponent, extractTypeComponent } from 'Components';
import { BoolType } from 'Implementations/Generics';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';

export function visitLessEqual(visitor: YaplVisitor, ctx: LessEqualContext) {
  // Must be done between two possible integers
  // TODO: Add value
  const [leftChild, rightChild] = ctx.expression();
  const boolTable = visitor.findTable(BoolType.Name)!.copy();

  const lExpr = extractTypeComponent(visitor.visit(leftChild));
  const rExpr = extractTypeComponent(visitor.visit(rightChild));
  let entered = false;
  if (!lExpr) {
    visitor.addError(ctx, `Expression ${leftChild.text} cannot be operated with arithmetic`);
    entered = true;
  }
  if (!rExpr) {
    visitor.addError(ctx, `Expression ${rightChild.text} cannot be operated with arithmetic`);
    entered = true;
  }
  if (entered) {
    return new EmptyComponent();
  }

  const allowedComparison = lExpr!.allowsComparisonTo(rExpr!);

  // ERROR: If one of them is an ancestor of the other, they can be compared
  if (!allowedComparison) {
    const leftName = leftChild.text ?? leftChild.toString();
    const rightName = rightChild.text ?? rightChild.toString();
    visitor.addError(ctx, `Invalid Operation between ${leftName} and ${rightName}`);
    return new EmptyComponent();
  }
  return boolTable;
}
