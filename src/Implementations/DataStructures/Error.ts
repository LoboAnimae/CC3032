import { BasicStorage } from '../Errors/Errors';

export const lineAndColumn = (ctx: any): { line: number; column: number } => ({
  line: ctx.start?.line ?? 0,
  column: ctx.start?.charPositionInLine ?? 0,
});
export interface IError {
  message: string;
  line: number;
  column: number;
}

export default class ErrorComponent extends BasicStorage<IError> {
  constructor() {
    super();
  }
  addError(ctx: any, ...errorMessage: string[]): void {
    for (const message of errorMessage) {
      const line = ctx.start?.line ?? 0;
      const column = ctx.start?.charPositionInLine ?? 0;
      this.elements.push({ line, column, message });
    }
  }
}
