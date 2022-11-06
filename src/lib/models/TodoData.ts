export type TodoTabData = {
	id: number;
	title: string;
	todoItems: TodoItemData[];
	todoDisplayId: number;
	createdAt?: Date;
	updatedAt?: Date;
	sortOrder: number;
};

export const TodoTabConstr = {
	title: {
		maxlength: 100
	}
};

export type TodoItemData = {
	id: number;
	title: string;
	status: string;
	todoTabId: number;
	createdAt?: Date;
	updatedAt?: Date;
	sortOrder: number;
};

export const TodoItemConstr = {
	title: {
		maxlength: 50
	}
};

export type TodoDisplayData = {
	id: number;
	title: string;
	todoTabs: TodoTabData[];
	createdAt?: Date;
	updatedAt?: Date;
};

export type TodoItemDndData = CustomEvent<DndEvent<TodoItemData>>;
export type TodoTabDndData = CustomEvent<DndEvent<TodoTabData>>;
