export type TodoTabData = {
	id: number;
	title: string;
	todoItems: TodoItemData[];
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
};

export const TodoItemConstr = {
	title: {
		maxlength: 50
	}
};
