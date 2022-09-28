import { TrueContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';
import { QuadrupleComponent, QuadrupleElement } from '../Components';

export default function visitTrue(visitor: YaplVisitor, ctx: TrueContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: true });
  newBool.addComponent(boolValue);
  const representingQuadruple = new QuadrupleElement({
    id: newBool.id,
    elements: ['1', null]
  });
  const quadrupleComponent = new QuadrupleComponent({initialValues: [representingQuadruple]})

  newBool.addComponent(quadrupleComponent);
  return newBool;
}
