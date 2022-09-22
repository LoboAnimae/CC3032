import { BasicInfoComponent, TableImpl, CompositionComponent, TypeImpl, ValueHolderComponent } from "../Components";

export default class Bool extends CompositionComponent {
    static BoolType = new Bool();

    constructor() {
        super({ componentName: "Bool" });
        this.addComponent(new BasicInfoComponent({ name: "Bool" }));
        this.addComponent(new TableImpl());
        this.addComponent(new TypeImpl({
            isGeneric: true,
            sizeInBytes: 1,
        }));

        // @ts-ignore 
        this.allowsAssignmentOf = function (value?: CompositionComponent): boolean { return ["Integer", "Bool"].includes(value?.componentName ?? ""); };
        // @ts-ignore
        this.allowsComparisonTo = function (value?: CompositionComponent): boolean { return ["Integer", "Bool"].includes(value?.componentName ?? ""); };
        // @ts-ignore
        this.coherseType = function (value?: CompositionComponent): Integer | null {
            if (value?.componentName === "Bool") {
                return value as Bool;
            } else if (value?.componentName === "Integer") {
                const newBool = new Bool();
                const foundValue = value.getComponent<ValueHolderComponent>({ name: "ValueHolder" });
                if (foundValue !== null) {
                    newBool.addComponent(new ValueHolderComponent({ value: !!foundValue?.value }));
                }
                return newBool;
            }
            return null;
        };
    }

    copy(): Bool {
        return new Bool();
    }

    setMethods(into: any): void { }
}