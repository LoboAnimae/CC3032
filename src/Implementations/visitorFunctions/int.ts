import { IntContext } from '../../antlr/yaplParser';
import { ValueComponent } from '../Components/index';
import IntType from '../Generics/Integer.type';
import { YaplVisitor } from './meta';

export default function visitInt(visitor: YaplVisitor, ctx: IntContext) {
  const newInt = new IntType();
  newInt.addComponent(new ValueComponent({ value: parseInt(ctx.INT().text) }));
  /*
  Why does this component not have a quadrupleElement representation, you ask?
    1. It holds no memory representation.
    2. It can be hardcoded.
    3. It is a terminal node that holds no variable value, such as Booleans and Strings
   */
  return newInt;
}
