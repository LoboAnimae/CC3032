import { CompositionComponent } from '.';

export function isEmptyComponent(inComponent?: CompositionComponent | null) {
  return inComponent?.componentName === EmptyComponent.Name;
}

export class EmptyComponent extends CompositionComponent {
  static Name = 'EmptyComponent';
  static Type = CompositionComponent.Type;
  constructor() {
    super();
    this.componentName = EmptyComponent.Name;
    this.componentType = EmptyComponent.Type;
  }
  clone(): CompositionComponent {
    return new EmptyComponent();
  }
}
