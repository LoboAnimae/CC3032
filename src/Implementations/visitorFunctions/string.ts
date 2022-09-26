import { StringContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import StringType from '../Generics/String.type';
import { YaplVisitor } from './meta';

export default function visitString(visitor: YaplVisitor, ctx: StringContext) {
  const newString = new StringType();
  const stringValue = new ValueComponent({ value: ctx.STRING().text });
  newString.addComponent(stringValue);
  return newString;
}
