import Composition from "./Composition";

export interface PositioningParams {
  line: number;
  column: number;
}

//#region Interfaces
/**
 * If something implements this, then positions can be stored
 */
class PositioningComponent extends Composition {
  public line?: number;
  public column?: number;
  constructor(options?: Partial<PositioningParams>) {
    super({ componentName: "Positioning" });
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

  setMethods(into: any): void {
    into.getLine = this.getLine;
    into.getColumn = this.getColumn;
    into.setLine = this.setLine;
    into.setColumn = this.setColumn;
  }

  copy(): Composition {
    return new PositioningComponent({ line: this.line, column: this.column });
  }

  configure(into: any): void {}
}

export interface PositioningSupport {
  components: { position: PositioningComponent };
}

export default PositioningComponent;
