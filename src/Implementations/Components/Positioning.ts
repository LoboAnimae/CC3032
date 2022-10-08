import Composition from './Composition';

export interface PositioningParams {
  line: number;
  column: number;
}

export function extractPositioning(inComponent?: Composition | null) {
  if (!inComponent) return null;
  return inComponent.getComponent<PositioningComponent>({ componentType: PositioningComponent.Type });
}

//#region Interfaces
/**
 * If something implements this, then positions can be stored
 */
class PositioningComponent extends Composition {
  static Name = "Positioning"
  static Type = "Positioning"
  public line?: number;
  public column?: number;
  constructor(options?: Partial<PositioningParams>) {
    super();
    this.componentName = PositioningComponent.Name;
    this.componentType = PositioningComponent.Type;
    this.line = options?.line;
    this.column = options?.column;
  }

  getLine = () => this.line;
  getColumn = () => this.column;
  setLine = (line: number) => {
    this.line = line;
  };
  setColumn = (column: number) => {
    this.column = column;
  };

  clone(): Composition {
    return new PositioningComponent({ line: this.line, column: this.column });
  }
}

export interface PositioningSupport {
  components: { position: PositioningComponent };
}

export default PositioningComponent;
