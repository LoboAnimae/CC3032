import Composition from "./Composition";

export interface PositioningParams {
  line: number;
  column: number;
}

export interface PositioningComponent {
  getLine: (() => number | undefined);
  getColumn: (() => number | undefined);
  setLine: ((line: number) => void);
  setColumn: ((column: number) => void);
}

//#region Interfaces
/**
 * If something implements this, then positions can be stored
 */
class PositioningImpl extends Composition {
  public line?: number;
  public column?: number;
  constructor(options?: Partial<PositioningParams>) {
    super({ componentName: "Positioning" });
    this.line = options?.line;
    this.column = options?.column;
  }

  setMethods(into: any): void {
    into.getLine = () => this.line;
    into.getColumn = () => this.column;
    into.setLine = (line: number) => {
      this.line = line;
    };
    into.setColumn = (column: number) => {
      this.column = column;
    };
  }
}

export interface PositioningSupport {
  components: { position: PositioningImpl; };
}

export default PositioningImpl;
