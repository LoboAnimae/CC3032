import { MultiplyContext } from 'antlr/yaplParser';
import { EmptyComponent, extractQuadruplet, extractTypeComponent, TypeComponent } from 'Components'
import MultOperation from 'Components'
import IntType from '../Generics/Integer.type';
import { YaplVisitor } from './meta';

export default function visitMultiply(visitor: YaplVisitor, ctx: MultiplyContext) {
  const [leftChild, rightChild] = ctx.expression();
  const intTable = visitor.findTable(IntType.Name)!.copy();

  const leftElement = visitor.visit(leftChild);
  const rightElement = visitor.visit(rightChild);

  const lExpr = extractTypeComponent(leftElement);
  const rExpr = extractTypeComponent(rightElement);

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

  // Quadruplet
  const quadrupletElement = new MultOperation();
  const lValueComponent = extractQuadruplet(leftElement);
  const rValueComponent = extractQuadruplet(rightElement);
  quadrupletElement.elements = [lValueComponent, rValueComponent];
  intTable.addComponent(quadrupletElement);
  // visitor.addQuadruple(quadrupletElement);
  return intTable;
}
