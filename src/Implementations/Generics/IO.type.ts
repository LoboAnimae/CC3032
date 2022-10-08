import { CompositionComponent, TableComponent } from '../Components';
import { MethodElement, SymbolElement } from '../DataStructures/TableElements';
import Integer from './Integer.type';
import { Primitive } from './Primitive.type';
import StringType from './String.type';

export class IOType extends Primitive {
  static Name = 'IO';
  static Type = 'IO';
  defaultValue: null = null;
  allowsAssignmentOf = (_incomingType?: CompositionComponent | undefined) => false;
  allowsComparisonTo = (_incomingType?: CompositionComponent | undefined) => false;
  coherseType = (_incomingType?: CompositionComponent | undefined, _value?: any) => {
    throw new Error('Cannot coherse IOType');
  };
  constructor() {
    super({ name: IOType.Name });
    this.componentName = IOType.Name;
    this.sizeInBytes = 1;

    const tableComponent = new TableComponent();

    const outStringMethod = new MethodElement({
      name: 'out_string',
      type: this,
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    outStringMethod.addParameters(
      new SymbolElement({ name: 'x', type: new StringType(), scopeName: this.componentName, memoryAddress: -1 }),
    );

    const outIntMethod = new MethodElement({
      name: 'out_int',
      type: this,
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    outIntMethod.addParameters(
      new SymbolElement({ name: 'x', type: new Integer(), scopeName: this.componentName, memoryAddress: -1 }),
    );

    const inStringMethod = new MethodElement({
      name: 'in_string',
      type: new StringType(),
      scopeName: this.componentName,
      memoryAddress: -1,
    });
    const inIntMethod = new MethodElement({
      name: 'in_int',
      type: new Integer(),
      scopeName: this.componentName,
      memoryAddress: -1,
    });

    tableComponent.add(outStringMethod, outIntMethod, inStringMethod, inIntMethod);

    this.addComponent(tableComponent);
  }

  clone(): IOType {
    return new IOType();
  }
}
