import { TrueContext } from 'antlr/yaplParser';
import ValueComponent from 'Components'
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';

export default function visitTrue(_visitor: YaplVisitor, _ctx: TrueContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: 1 });
  newBool.addComponent(boolValue);
  /*
  Why does this component not have a triplet representation, you ask?
    1. It holds no memory representation.
    2. It can be hardcoded.
    3. It is a terminal node that holds no variable value, such as Integers and Strings
   */
  return newBool;
}
