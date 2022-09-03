interface IStack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T;
  size(): number;
}

export class Stack<T> implements IStack<T> {
  private readonly items: T[] = [];
  push(...item: T[]): void {
    this.items.push(...item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T {
    return this.items[this.items.length - 1];
  }
  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getItem(index: number): T {
    return this.items[index];
  }
}
