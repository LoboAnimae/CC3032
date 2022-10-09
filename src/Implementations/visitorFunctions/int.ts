import { IntContext } from '../../antlr/yaplParser';
import { ValueComponent } from '../Components/index';
import SimpleHolder from '../Components/Quadruple/SimpleHolder';
import IntType from '../Generics/Integer.type';
import { YaplVisitor } from './meta';

export default function visitInt(visitor: YaplVisitor, ctx: IntContext) {
  const newInt = new IntType();
  newInt.addComponent(new ValueComponent({ value: parseInt(ctx.INT().text) }));

  const quadrupletElement = new SimpleHolder();
  quadrupletElement.setValue(parseInt(ctx.INT().text));
  newInt.addComponent(quadrupletElement);
  // visitor.addQuadruple(quadrupletElement)
  return newInt;
}
