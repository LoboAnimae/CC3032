import {
  CompositionComponent,
  BasicInfoComponent,
  TableComponent,
  TypeComponent,
  ValueHolderComponent,
} from "../Components";
import { Primitive } from "./Primitive.type";

export default class Bool extends Primitive {
  static Name = "Bool";
  static BoolType = new Bool();

  constructor() {
    super({ name: Bool.Name, sizeInBytes: 1, isGeneric: true, parent: null });
    const newBasicInfo = new BasicInfoComponent({ name: Bool.Name });
    const newTable = new TableComponent();

    newBasicInfo.configure(this);
    newTable.configure(this);
    
    this.addComponent(newBasicInfo);
    this.addComponent(newTable);
    this.configure(this);
  }

  configure(into: any): void {
    this.setMethods(into)
  }

  copy(): Bool {
    return new Bool();
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    if (value === null || value === undefined) return false;
    const typeComponent = value instanceof TypeComponent ? value : value?.getComponent(TypeComponent);
    if (!typeComponent) return false;
    return ["Integer", "Bool"].includes(typeComponent.name ?? "");
  };
  allowsComparisonTo = function (value?: CompositionComponent): boolean {
    if (value === null || value === undefined) return false;
    const typeComponent = value instanceof TypeComponent ? value : value?.getComponent(TypeComponent);
    if (!typeComponent) return false
    return ["Integer", "Bool"].includes(typeComponent.name ?? "");
  };
  coherseType = function (value?: CompositionComponent): Bool | null {
    if (value === null || value === undefined) return null;
    const typeComponent = value instanceof TypeComponent ? value : value?.getComponent(TypeComponent);
    if (!typeComponent) return null;
    if (typeComponent.name === "Bool") {
      return value as Bool;
    } else if (typeComponent.name === "Integer") {
      const newBool = new Bool();
      const foundValue = value.getComponent(ValueHolderComponent);
      if (foundValue !== null) {
        newBool.addComponent(new ValueHolderComponent({ value: !!foundValue.getValue() }));
      }
      return newBool;
    }
    return null;
  };


  setMethods(into: any): void {}
}
