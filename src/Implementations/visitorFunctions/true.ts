import { TrueContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';

export default function visitTrue(visitor: YaplVisitor, ctx: TrueContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: true });
  newBool.addComponent(boolValue);
  return newBool;
}
