import { EventEmitter } from "node:events";
export const ErrorListener = new EventEmitter();
export const newFatal = "newFatal";
export const newError = "newError";
export const newWarning = "newWarning";
export const newInfo = "newInfo";
export const newDebug = "newDebug";

export interface IPositioning {
  start: number;
  end: number;
}

export enum ErrorLevel {
  Fatal, // The program can't continue
  Error, // The program found an error, but it can continue
  Warning, // Just a general warning. No errors
  Info, // Informational message
  Debug, // Debug message
}

export enum ErrorType {
  UNKNOWN,
  // INHERITANCE
  SELF_INHERITANCE,
}

const errors = ["UNKNOWN ERROR", "SELF_INHERITANCE"];

class Error {
  private _level?: ErrorLevel;
  private _type?: ErrorType;
  private _message?: string;
  private _messageIsSet = false;
  private _line?: number;
  private _column?: IPositioning;
  private _entireLine?: string;
  constructor() {}

  get level() {
    return this._level ?? ErrorLevel.Error;
  }
  set level(level: ErrorLevel) {
    this._level = level;
  }

  get type() {
    return this._type ?? ErrorType.UNKNOWN;
  }
  set type(newType: ErrorType) {
    this._type = newType;
  }

  get message() {
    return this._messageIsSet ? this._message ?? "" : errors[this.type]!;
  }

  set message(newMessage: string) {
    this._message = newMessage;
    this._messageIsSet = true;
  }

  get line() {
    return this._line ?? -1;
  }

  set line(newLine: number) {
    this._line = newLine;
  }

  get column() {
    return this._column ?? { start: -1, end: -1 };
  }

  set column(newColumn: IPositioning) {
    this._column = { ...newColumn }; // Deep copy
  }
}

ErrorListener.on(newFatal, (error: Error) => {});

export default ErrorListener;
