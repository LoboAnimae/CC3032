import { FalseContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';

export default function visitFalse(visitor: YaplVisitor, ctx: FalseContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: false });
  newBool.addComponent(boolValue);
  return newBool;
}
