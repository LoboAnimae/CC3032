import { LessEqualContext } from '../../antlr/yaplParser';
import EmptyComponent from '../Components/EmptyComponent';
import { extractTypeComponent } from '../Components/Type';
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';

export default function visitLessEqual(visitor: YaplVisitor, ctx: LessEqualContext) {
  // Must be done between two possible integers
  // TODO: Add value
  const [leftChild, rightChild] = ctx.expression();
  const boolTable = visitor.findTable(BoolType.Name)!.copy();

  const lExpr = extractTypeComponent(visitor.visit(leftChild));
  const rExpr = extractTypeComponent(visitor.visit(rightChild));
  if (!lExpr || !rExpr) {
    visitor.addError(ctx, `One of the expressions is not a type`);
    return new EmptyComponent();
  }

  const allowedComparison = lExpr.allowsComparisonTo(rExpr);

  // ERROR: If one of them is an ancestor of the other, they can be compared
  if (!allowedComparison) {
    visitor.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
    return new EmptyComponent();
  }
  return boolTable;
}
