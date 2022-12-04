import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';

export type TodoTabDndData = TodoTabData & { dndId: string; hidden: boolean };
export type TodoTabDndEvent = CustomEvent<DndEvent<TodoTabDndData>>;

export type TodoItemDndData = TodoItemData & { dndId: string; hidden: boolean };
export type TodoItemDndEvent = CustomEvent<DndEvent<TodoItemDndData>>;

export type TodoDisplayDndData = TodoDisplayData & { dndId: string };
export type TodoDisplayDndEvent = CustomEvent<DndEvent<TodoDisplayDndData>>;
