import { MultiplyContext } from '../../antlr/yaplParser';
import { EmptyComponent, extractQuadruplet, extractTypeComponent, TypeComponent } from '../Components/index';
import MultOperation from '../Components/Quadruple/MultOperation';
import IntType from '../Generics/Integer.type';
import { YaplVisitor } from './meta';

export default function visitMultiply(visitor: YaplVisitor, ctx: MultiplyContext) {
  const [leftChild, rightChild] = ctx.expression();
  const intTable = visitor.findTable(IntType.Name)!.copy();

  const leftElement = visitor.visit(leftChild);
  const rightElement = visitor.visit(rightChild);

  const lExpr = extractTypeComponent(leftElement);
  const rExpr = extractTypeComponent(rightElement);

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

  // Quadruplet
  const quadrupletElement = new MultOperation();
  const lValueComponent = extractQuadruplet(leftElement);
  const rValueComponent = extractQuadruplet(rightElement);
  quadrupletElement.elements = [lValueComponent, rValueComponent];
  intTable.addComponent(quadrupletElement);
  visitor.addQuadruple(quadrupletElement);
  return intTable;
}
