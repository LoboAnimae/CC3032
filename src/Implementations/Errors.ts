import { IError } from "../Interfaces/Errors.interface";

export class Errors {
  public readonly errors: IError[];
  constructor() {
    this.errors = [];
  }

  addError = (error: IError) => {
    if (this.errorExists(error)) return;
    this.errors.push(error);
  };

  errorExists = (error: IError) => {
    return !!this.errors.find(
      (err) =>
        err.message === error.message &&
        err.line === error.line &&
        err.column === error.column
    );
  };
  getErrors = (): IError[] => this.errors;
}
