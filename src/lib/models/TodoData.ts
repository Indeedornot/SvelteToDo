export type TodoTabData = {
	id: number;
	title: string;
	todoItems: TodoItemData[];
	createdAt: Date;
	updatedAt: Date;
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
	createdAt: Date;
	updatedAt: Date;
};

export const TodoItemConstr = {
	title: {
		maxlength: 50
	}
};

export type TodoDisplay = {
	id: number;
	title: string;
	todoTabs: TodoTabData[];
	createdAt: Date;
	updatedAt: Date;
}