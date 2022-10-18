import { IError } from '../Interfaces/Error';
import { BasicStorage } from '../Implementations/DataStructures/BasicStorage';

export class ErrorComponent extends BasicStorage<IError> {
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
