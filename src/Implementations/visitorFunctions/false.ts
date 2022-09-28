import { FalseContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';
import { QuadrupleComponent, QuadrupleElement } from '../Components';

export default function visitFalse(visitor: YaplVisitor, ctx: FalseContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: false });
  newBool.addComponent(boolValue);

  const representingQuadruple = new QuadrupleElement({
    id: newBool.id,
    elements: ['0', null],
  });
  const quadrupleComponent = new QuadrupleComponent({ initialValues: [representingQuadruple] });

  newBool.addComponent(quadrupleComponent);
  return newBool;
}
