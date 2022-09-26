import { IntContext } from '../../antlr/yaplParser';
import { ValueComponent } from '../Components/index';
import IntType from '../Generics/Integer.type';
import { YaplVisitor } from './meta';

export default function visitInt(visitor: YaplVisitor, ctx: IntContext) {
  const newInt = new IntType();
  newInt.addComponent(new ValueComponent({ value: parseInt(ctx.INT().text) }));
  return newInt;
}
