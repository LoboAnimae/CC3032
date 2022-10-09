import { CompositionComponent } from './index';

export function isEmptyComponent(inComponent?: CompositionComponent | null) {
  return !!inComponent?.children.length;
}

export default class EmptyComponent extends CompositionComponent {
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
