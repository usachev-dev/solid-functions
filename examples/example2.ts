interface Deletes<T> {
  delete(id: string): void;
}

export class Deleter<T> implements Deletes<T> {
  private item: T;
  delete(id: string): void {}
}
