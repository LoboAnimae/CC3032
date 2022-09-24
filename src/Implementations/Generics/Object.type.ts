import { BasicInfoComponent, CompositionComponent, TableComponent, TypeComponent } from "../Components";
import { Method } from "../DataStructures/Method.type";
import { Primitive } from "./Primitive.type";
import String from "./String.type";

export class ObjectType extends Primitive {
  static Name = "Object";
  static ObjectType = new ObjectType();

  constructor() {
    super({name: ObjectType.Name, sizeInBytes: 1, isGeneric: false, parent: null });
    this.addComponent(new BasicInfoComponent({ name: ObjectType.Name }));

    const tableComponent = new TableComponent();
    this.addComponent(tableComponent);

    this.configure(this);
    const abortMethod = new Method({ name: "abort", type: this });
    const typeNameMethod = new Method({ name: "type_name", type: new String() });
    const copyMethod = new Method({ name: "copy", type: this });

    tableComponent.add(abortMethod, typeNameMethod, copyMethod);
  }

  allowsAssignmentOf = function (value?: CompositionComponent): boolean {
    if (!value) return false;
    const typeComponent = value.getComponent(TypeComponent);
    if (!typeComponent) return false;
    const entireHerarchy = typeComponent.getHierarchy();
    return entireHerarchy.map((t) => t.name).includes(ObjectType.Name);
  };
  configure(into: any): void {

  }
  copy(): ObjectType {
    const newObject = new ObjectType();
    for (const component of this.children) {
      newObject.addComponent(component.copy());
    }
    return newObject;
  }
  setMethods(into: CompositionComponent): void {}
}
