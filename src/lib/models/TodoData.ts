export type TodoDisplayData = {
	id: number;
	title: string;
	todoTabs: TodoTabData[];
	sortOrder: number;
	createdAt?: string;
	updatedAt?: string;
};

export type TodoTabData = {
	id: number;
	title: string;
	sortOrder: number;
	todoDisplayId: number;
	todoItems: TodoItemData[];
	createdAt?: string;
	updatedAt?: string;
	hidden?: boolean;
};

export type TodoItemData = {
	id: number;
	title: string;
	sortOrder: number;
	status: string;
	todoTabId: number;
	createdAt?: string;
	updatedAt?: string;
	collapsed: boolean;
	hidden?: boolean;
};
