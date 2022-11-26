export type TodoDisplayData = {
	id: number;
	title: string;
	todoTabs: TodoTabData[];
	sortOrder: number;
	createdAt?: Date;
	updatedAt?: Date;
};

export type TodoTabData = {
	id: number;
	title: string;
	sortOrder: number;
	todoDisplayId: number;
	todoItems: TodoItemData[];
	createdAt?: Date;
	updatedAt?: Date;
	hidden?: boolean;
};

export type TodoItemData = {
	id: number;
	title: string;
	sortOrder: number;
	status: string;
	todoTabId: number;
	createdAt?: Date;
	updatedAt?: Date;
	collapsed: boolean;
	hidden?: boolean;
};
