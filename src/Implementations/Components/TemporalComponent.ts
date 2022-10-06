import Composition from './Composition';
import { SymbolElement } from '../DataStructures/TableElements';

export function isTemporalComponent(component?: Composition) {
  return component?.componentType === 'TemporalComponent';
}

export default class TemporalComponent extends Composition {
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
    return `TemporalComponent{${this.referencedElement ?? this.id}}`;
  }
}
