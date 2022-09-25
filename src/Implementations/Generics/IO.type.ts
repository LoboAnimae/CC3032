import { BasicInfoComponent, CompositionComponent, TableComponent } from '../Components';
import ComponentInformation from '../Components/ComponentInformation';
import { MethodElement, SymbolElement } from '../DataStructures/TableElements';
import Integer from './Integer.type';
import { Primitive } from './Primitive.type';
import StringType from './String.type';

export class IOType extends Primitive {
  defaultValue: null = null;
  allowsAssignmentOf = (_incomingType?: CompositionComponent | undefined) => false;
  allowsComparisonTo = (_incomingType?: CompositionComponent | undefined) => false;
  coherseType = (_incomingType?: CompositionComponent | undefined, _value?: any) => {
    throw new Error('Cannot coherse IOType');
  };
  constructor() {
    const { IO } = ComponentInformation.type;
    super({ name: IO.name });
    this.componentName = IO.name;
    this.sizeInBytes = 1;

    const tableComponent = new TableComponent();

    const outStringMethod = new MethodElement({ name: 'out_string', type: this });
    outStringMethod.addParameters(new SymbolElement({ name: 'x', type: new StringType() }));

    const outIntMethod = new MethodElement({ name: 'out_int', type: this });
    outIntMethod.addParameters(new SymbolElement({ name: 'x', type: new Integer() }));

    const inStringMethod = new MethodElement({ name: 'in_string', type: new StringType() });
    const inIntMethod = new MethodElement({ name: 'in_int', type: new Integer() });

    tableComponent.add(outStringMethod, outIntMethod, inStringMethod, inIntMethod);

    this.addComponent(tableComponent);
  }

  clone(): IOType {
    return new IOType();
  }
}
