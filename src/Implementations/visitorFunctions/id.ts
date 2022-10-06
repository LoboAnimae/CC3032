import { IdContext } from '../../antlr/yaplParser';
import { extractBasicInformation, extractQuadruplet, extractTableComponent } from '../Components';
import EmptyComponent from '../Components/EmptyComponent';
import SimpleHolder from '../Components/Quadruple/SimpleHolder';
import { TableElementType } from '../DataStructures/TableElements';
import { YaplVisitor } from './meta';

export default function visitId(visitor: YaplVisitor, ctx: IdContext) {
  // Find it in the scope
  const name = ctx.IDENTIFIER();
  const currentScope = visitor.getCurrentScope();

  if (name.text.toLocaleLowerCase() === 'self') {
    return currentScope;
  }

  const tableComponent = extractTableComponent<TableElementType>(currentScope);
  if (!tableComponent) {
    return new EmptyComponent();
  }

  const foundComponent: TableElementType | null = tableComponent.get(name.text);

  if (!foundComponent) {
    const basicInfo = extractBasicInformation(currentScope);
    visitor.addError(ctx, `Symbol '${name.toString()}' is not defined in scope '${basicInfo!.name}'`);
    return new EmptyComponent();
  }
  const previousQuadruplet = extractQuadruplet(foundComponent) as SimpleHolder;

  const quadrupletElement = previousQuadruplet ?? new SimpleHolder();

  quadrupletElement.setValue(foundComponent);
  if (!previousQuadruplet) {
    foundComponent.addComponent(quadrupletElement);
  }
  visitor.addQuadruple(quadrupletElement)

  return foundComponent;
}
