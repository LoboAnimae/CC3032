import {CompositionComponent} from 'Components';
import { SymbolElement } from 'Implementations/DataStructures/TableElements';

export function isTemporalComponent(component?: CompositionComponent) {
  return component?.componentType === 'TemporalComponent';
}

export class TemporalComponent extends CompositionComponent {
  referencedElement?: SymbolElement;
  constructor(references?: SymbolElement) {
    super();
    this.referencedElement = references;
    this.componentType = 'TemporalComponent';
  }

  clone() {
    return new TemporalComponent(this.referencedElement);
  }

  toString(): string {
    return `TemporalComponent{${this.referencedElement ?? this.id.substring(0, 8)}}`;
  }
}
