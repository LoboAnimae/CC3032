import { AddContext } from '../../antlr/yaplParser';
import EmptyComponent from '../Components/EmptyComponent';
import {
  CompositionComponent,
  extractBasicInformation,
  extractTableComponent,
  extractValueComponent,
  TripletComponent,
} from '../Components/index';
import TemporalComponent from '../Components/TemporalComponent';
import AddOperation from '../Components/Triplet/AddOperation';
import { extractTypeComponent } from '../Components/Type';
import SymbolElement from '../DataStructures/TableElements/SymbolElement';
import { PossibleScope, Scope, YaplVisitor } from './meta';

export default function visitAdd(visitor: YaplVisitor, ctx: AddContext) {
  // TODO: Add value
  // Must be done between two possible integers
  const [leftChild, rightChild] = ctx.expression();
  const boolTable = visitor.findTable('Bool')!.copy();

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

  const tripletElement = new AddOperation();
  const basicInfoExtractor = (grabbing: CompositionComponent) => {
    const basicInfo = extractBasicInformation(grabbing);
    if (!basicInfo) return 'UNKNOWN';
    const currentScope: PossibleScope = visitor.getCurrentScope();
    const tableScope = extractTableComponent(currentScope)!;
    const name = basicInfo.getName();
    const foundValue: SymbolElement | null = tableScope.get(name) as SymbolElement;
    if (!foundValue) throw new Error('UNKNOWN VARIABLE');
    const scopeName = foundValue.scopeName;
    return `${scopeName}.${name}`;
  };
  const lValueComponent = extractValueComponent(lExpr)?.getValue() ?? basicInfoExtractor(leftElement);
  const rValueComponent = extractValueComponent(rExpr)?.getValue() ?? basicInfoExtractor(rightElement);
  // tripletElement.elements = [lExpr.]
  tripletElement.elements = [lValueComponent, rValueComponent];
  tripletElement.assigningTo = new TemporalComponent();
  const tripletComponent = new TripletComponent();

  tripletComponent.merge(tripletElement);
  boolTable.addComponent(tripletComponent);
  return boolTable;
}
