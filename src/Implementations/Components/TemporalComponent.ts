import Composition from './Composition';


export function isTemporalComponent(component?: Composition) {
  return component?.componentType === 'TemporalComponent';
}

export default class TemporalComponent extends Composition {
  constructor() {
    super();
    this.componentType = 'TemporalComponent';
  }

  clone() {
    return new TemporalComponent();
  }
}