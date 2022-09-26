import ComponentInformation from './ComponentInformation';
import Composition from './Composition';

export interface PositioningParams {
  line: number;
  column: number;
}

export function extractPositioning(inComponent?: Composition | null) {
  if (!inComponent) return null;
  const { Positioning } = ComponentInformation.components;
  return inComponent.getComponent<PositioningComponent>({ componentType: Positioning.type });
}

//#region Interfaces
/**
 * If something implements this, then positions can be stored
 */
class PositioningComponent extends Composition {
  public line?: number;
  public column?: number;
  constructor(options?: Partial<PositioningParams>) {
    super();
    const { Positioning } = ComponentInformation.components;
    this.componentName = Positioning.name;
    this.componentType = Positioning.type;
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
