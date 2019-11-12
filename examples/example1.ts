interface ICrud<T> {
  create(id: string): void;
  request(id: string): T;
  update(id: string): void;
  delete(id: string): void;
}

export class Crud<T> implements ICrud<T> {
  private item: T;
  create(id: string): void {}
  request(id: string): T {
    return this.item;
  }
  update(id: string): void {}
  delete(id: string): void {}
}
