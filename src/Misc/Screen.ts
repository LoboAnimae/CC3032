import { EventEmitter } from "node:events";
/**
 * The screen will attempt to render from the bottom to the top.
 */
export const ScreenListener = new EventEmitter();
export const lineActions = {
  add: "addLine",
  update: "updateLine",
  clear: "clearLine",
  resetLine: "resetLine",
};

let previousMessage = "";

ScreenListener.on(lineActions.add, (newLine: string) => {
  ScreenListener.emit(lineActions.resetLine, newLine);
  process.stdout.write("\r" + newLine + "\n> " + previousMessage);
});
ScreenListener.on(lineActions.update, (newLine: string) => {
  ScreenListener.emit(lineActions.resetLine);
  process.stdout.write("\r> " + newLine);
  previousMessage = newLine;
});
ScreenListener.on(lineActions.clear, () => console.clear());
ScreenListener.on(lineActions.resetLine, () =>
  process.stdout.write("\r" + " ".repeat(previousMessage.length * 2) + "\r")
);
export default ScreenListener;
