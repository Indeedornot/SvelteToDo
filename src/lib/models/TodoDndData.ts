import type { TodoItemData, TodoTabData } from '$lib/models/TodoData';

export type TodoTabDndData = TodoTabData & { dndId: string };
export type TodoTabDndEvent = CustomEvent<DndEvent<TodoTabDndData>>;

export type TodoItemDndData = TodoItemData & { dndId: string };
export type TodoItemDndEvent = CustomEvent<DndEvent<TodoItemDndData>>;
