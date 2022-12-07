import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';

export type TodoTabDndEvent = CustomEvent<DndEvent<TodoTabData>>;

export type TodoItemDndEvent = CustomEvent<DndEvent<TodoItemData>>;

export type TodoDisplayDndEvent = CustomEvent<DndEvent<TodoDisplayData>>;
