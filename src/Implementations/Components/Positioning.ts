export interface Params {
  line: number;
  column: number;
}
//#region Interfaces
/**
 * If something implements this, then positions can be stored
 */
export class Component {
  public line?: number;
  public column?: number;
  constructor(options?: Partial<Params>) {
    this.line = options?.line;
    this.column = options?.column;
  }
}
export type Type = Component;

export interface Support {
  components: { position: Component };
  getPositionComponent(): Component;
  setPositionComponent(newComponent: Component): void;
}
