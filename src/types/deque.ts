export class Deque<T> {
  private items: T[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  addFront(item: T): void {
    this.items.unshift(item);
    if (this.items.length > this.maxSize) {
      this.items.pop(); // 뒤쪽에서 오래된 항목 제거
    }
  }

  addBack(item: T): void {
    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift(); // 앞쪽에서 오래된 항목 제거
    }
  }

  removeFront(): T | undefined {
    return this.items.shift();
  }

  removeBack(): T | undefined {
    return this.items.pop();
  }

  peekFront(): T | undefined {
    return this.items[0];
  }

  peekBack(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }

  getItems(): T[] {
    return this.items;
  }
}
