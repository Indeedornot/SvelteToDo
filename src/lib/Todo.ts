export type Todo = {
  id: number;
  title: string;
  status: TodoStatus;
}

enum TodoStatus {
  Draft,
  Completed,
  InProgress,
  Archived,
  Abandoned,
}