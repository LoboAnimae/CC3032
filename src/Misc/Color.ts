enum colors {
    RED = '\x1b[31m',
    GREEN = '\x1b[32m',
    YELLOW = '\x1b[33m',
    BLUE = '\x1b[34m',
    MAGENTA = '\x1b[35m',
    CYAN = '\x1b[36m',
    RESET = '\x1b[0m',
}

export class Color {
    static RED = colors.RED;
    static GREEN = colors.GREEN;
    static YELLOW = colors.YELLOW;
    static BLUE = colors.BLUE;
    static MAGENTA = colors.MAGENTA;
    static CYAN = colors.CYAN;
    static RESET = colors.RESET;

    constructor() { }

    static colorize(text: string, color: string = Color.RED) {
        return color + text + Color.RESET;
    }

    static error(text: string) {
        return Color.colorize(text, Color.RED);
    }

    static info(text: string) {
        return Color.colorize(text, Color.BLUE);
    }

    static warning(text: string) {
        return Color.colorize(text, Color.YELLOW);
    }

    static member(text: string) {
        return Color.colorize(text, Color.MAGENTA);
    }

    static scope(text: string) {
        return Color.colorize(text, Color.CYAN);
    }

    static type(text: string) {
        return Color.class(text);
    }

    static class(text: string) {
        return Color.colorize(text, Color.YELLOW);
    }

    static raw(text: string) {
        return Color.info(text);
    }

}