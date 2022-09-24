import {
    BasicInfoComponent,
    CompositionComponent,
    TableComponent,
    TableInstance,
    TypeComponent,
    TypeInstance,
    ValueHolderComponent,
} from "../Components";
import { Method, SymbolElement } from "../DataStructures/Method.type";

interface ClassTypeParams {
    name: string;
    parentType?: TypeComponent | null;
    basicComponent: BasicInfoComponent;
    typeComponent: TypeComponent;
}

export class ClassType extends CompositionComponent {
    static Name = "Class";
    static IOType = new ClassType();

    constructor(options?: Partial<ClassTypeParams>) {
        super({ componentName: ClassType.Name });
        this.addComponent(options?.basicComponent ?? new BasicInfoComponent({ name: options?.name ?? ClassType.Name }));

        const tableComponent = new TableComponent();
        this.addComponent(tableComponent);
        this.addComponent(options?.typeComponent ?? new TypeComponent({ name: options?.name ?? ClassType.Name, sizeInBytes: 0, parent: options?.parentType }));
    }

    toString(): string {
        return `<${this.componentName}> ${this.getComponent(TypeComponent)?.name}`;
    }

    configure(into: any): void { }
    copy(): ClassType {
        const newObject = new ClassType();
        for (const component of this.children) {
            newObject.addComponent(component.copy());
        }
        return newObject;
    }


    setMethods(into: CompositionComponent): void { }
}
