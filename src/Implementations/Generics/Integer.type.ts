
import { BasicInfoComponent, TableImpl, TypeImpl, ValueHolderComponent, CompositionComponent } from "../Components/index";


export default class Integer
  extends CompositionComponent {
  static IntegerType = new Integer();

  constructor() {
    super({ componentName: "Integer" });
    this.addComponent(new BasicInfoComponent({ name: "Integer" }));
    this.addComponent(new TableImpl());
    this.addComponent(new TypeImpl({
      isGeneric: true,
      sizeInBytes: 4,
    }));


    // @ts-ignore 
    this.allowsAssignmentOf = function (value?: CompositionComponent): boolean { return ["Integer", "Bool"].includes(value?.componentName ?? ""); };
    // @ts-ignore
    this.allowsComparisonTo = function (value?: CompositionComponent): boolean { return ["Integer", "Bool"].includes(value?.componentName ?? ""); };
    // @ts-ignore
    this.coherseType = function (value?: CompositionComponent): Integer | null {
      if (value?.componentName === "Integer") {
        return value as Integer;
      } else if (value?.componentName === "Bool") {
        const newInteger = new Integer();
        const foundValue = value.getComponent<ValueHolderComponent>({ name: "ValueHolder" });
        if (foundValue !== null) {
          newInteger.addComponent(new ValueHolderComponent({ value: Number(foundValue.value) }));
        }
        return newInteger;
      }
      return null;
    };
  }

  copy(): Integer {
    return new Integer();
  }

  setMethods(into: CompositionComponent): void {

  }
}
