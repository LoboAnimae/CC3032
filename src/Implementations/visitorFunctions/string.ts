import { StringContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import StringType from '../Generics/String.type';
import { YaplVisitor } from './meta';

export default function visitString(visitor: YaplVisitor, ctx: StringContext) {
  const newString = new StringType();
  const stringValue = new ValueComponent({ value: ctx.STRING().text });
  newString.addComponent(stringValue);
  /*
  Why does this component not have a quadrupleElement representation, you ask?
    1. It holds no memory representation.
    2. It can be hardcoded.
    3. It is a terminal node that holds no variable value, such as Integers and Booleans
  */
  return newString;
}
