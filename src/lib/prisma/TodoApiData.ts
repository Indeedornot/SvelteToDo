export type TodoDisplayApiData = {
	id: number;
	title: string;
	todoTabs?: TodoTabApiData[];
	createdAt?: Date;
	updatedAt?: Date;
};

export type TodoTabApiData = {
	id: number;
	title: string;
	sortOrder: number;
	todoDisplayId: number;
	todoItems?: TodoItemApiData[];
	createdAt?: Date;
	updatedAt?: Date;
};
export type TodoItemApiData = {
	id: number;
	title: string;
	sortOrder: number;
	status: string;
	todoTabId: number;
	createdAt?: Date;
	updatedAt?: Date;
};
