import { EqualContext } from 'antlr/yaplParser';
import { EmptyComponent, extractTypeComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { BoolType } from 'Implementations/Generics';

export default function visitEqual(visitor: YaplVisitor, ctx: EqualContext) {
  // TODO: Add value
  // Must be done between two possible integers
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
