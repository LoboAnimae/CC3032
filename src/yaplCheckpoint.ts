import { PropertyContext } from "./antlr/yaplParser";
import { IPositioning } from "./DataStructures/Table";

interface IInfo<T> {
  getInfo: () => T;
}

interface IBasicInformation {
  getName: () => string;
  getLine: () => number;
  getColumn: () => IPositioning;
}

interface ITypedInformation {
  getType: () => string;
}

interface PropertyContextHelperProperties {
  name: string;
  type: string;
  line: number;
  column: IPositioning;
}
class ContextHelper<T> implements IBasicInformation, IInfo<T> {
  protected name?: () => string;
  protected _ctx: PropertyContext;
  constructor(ctx: any) {
    this._ctx = ctx;
  }

  getName(): string {
    return this.name?.() ?? "Unknown!";
  }

  getLine(): number {
    return this._ctx.start?.line ?? -1;
  }

  getColumn(): IPositioning {
    const start = this._ctx.start?.charPositionInLine ?? -1;
    const end = start + this._ctx.text.length;
    return { start, end };
  }

  getInfo(): T {
    return {
      name: this.getName(),
      line: this.getLine(),
      column: this.getColumn(),
    } as T;
  }
}

export class PropertyContextHelper
  extends ContextHelper<PropertyContextHelperProperties>
  implements ITypedInformation
{
  constructor(ctx: PropertyContext) {
    super(ctx);
    this.name = () => ctx.IDENTIFIER().toString();
  }

  getType = (): string => this._ctx.TYPE().toString();
  getInfo = (): PropertyContextHelperProperties => {
    const info = super.getInfo();
    const type = this.getType();
    return { ...info, type };
  };
}
