export interface Node<T> {
  previousNode: Node<T> | null;
  value: T;
}
