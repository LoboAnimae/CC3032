import { CompositionComponent } from "./index";

export default class EmptyComponent extends CompositionComponent {
    constructor() {
        super({ componentName: "EmptyComponent" });
    }
    copy(): CompositionComponent {
        const newComponent = new EmptyComponent();
        for (const component of this.children) {
            newComponent.addComponent(component.copy());
        }
        return newComponent;
    }
    setMethods(into: CompositionComponent): void {
    }
    configure(into: any): void {
    }
}
