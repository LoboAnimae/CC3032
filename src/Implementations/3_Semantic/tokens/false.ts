import { FalseContext } from 'antlr/yaplParser';
import { ValueComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { BoolType } from 'Implementations/Generics/Boolean.type';

export default function visitFalse(_visitor: YaplVisitor, _ctx: FalseContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: 0 });
  newBool.addComponent(boolValue);
  /*
  Why does this component not have a quadrupleElement representation, you ask?
    1. It holds no memory representation.
    2. It can be hardcoded.
    3. It is a terminal node that holds no variable value, such as Integers and Strings
   */
  return newBool;
}
