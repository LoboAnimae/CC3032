import { AddContext } from '../../antlr/yaplParser';
import { YaplVisitor } from './meta';
import EmptyComponent from '../Components/EmptyComponent';
import { extractQuadruplet, extractValueComponent, QuadrupletComponent } from '../Components/index';
import AddOperation from '../Components/Quadruple/AddOperation';
import { extractTypeComponent } from '../Components/Type';
import IntegerType from '../Generics/Integer.type';

export default function visitAdd(visitor: YaplVisitor, ctx: AddContext) {
  // TODO: Add value
  // Must be done between two possible integers
  const [leftChild, rightChild] = ctx.expression();
  const intTable = visitor.findTable(IntegerType.Name)!.copy();

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
  // const quadrupletElement = new AddOperation();
  // const lValueComponent = extractQuadruplet(leftElement);
  // const rValueComponent = extractQuadruplet(rightElement);
  // quadrupletElement.elements = [lValueComponent, rValueComponent];
  // intTable.addComponent(quadrupletElement);
  // visitor.addQuadruple(quadrupletElement);
  return intTable;
}
