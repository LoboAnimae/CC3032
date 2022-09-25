import { CompositionComponent } from './index';
import ComponentInformation from './ComponentInformation';

export default class EmptyComponent extends CompositionComponent {
  constructor() {
    super();
    const { EmptyComponent } = ComponentInformation.components;
    this.componentName = EmptyComponent.name;
    this.componentType = EmptyComponent.type;
  }
  clone(): CompositionComponent {
    return new EmptyComponent();
  }
  copy(): CompositionComponent {
    const newComponent = new EmptyComponent();
    for (const component of this.children) {
      newComponent.addComponent(component.copy());
    }
    return newComponent;
  }
}
