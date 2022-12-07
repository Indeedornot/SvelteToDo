import type { Optional } from '$lib/helpers';

export type TodoDisplayData = {
	id: number;
	title: string;
	todoTabs: TodoTabData[];
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
};

export type TodoTabData = {
	id: number;
	title: string;
	sortOrder: number;
	todoDisplayId: number;
	todoItems: TodoItemData[];
	createdAt: string;
	updatedAt: string;
	hidden?: boolean;
};

export type TodoItemData = {
	id: number;
	title: string;
	sortOrder: number;
	status: statusType;
	todoTabId: number;
	createdAt: string;
	updatedAt: string;
	collapsed: boolean;
	hidden?: boolean;
};

export type TodoDisplayCreateData = Optional<Omit<TodoDisplayData, 'id' | 'createdAt' | 'updatedAt'>, 'todoTabs'>;

export type TodoTabCreateData = Optional<Omit<TodoTabData, 'id' | 'createdAt' | 'updatedAt'>, 'todoItems'>;

export type TodoItemCreateData = Omit<TodoItemData, 'id' | 'createdAt' | 'updatedAt'>;

export enum statusType {
	draft = 'draft',
	completed = 'completed',
	inProgress = 'inProgress',
	archived = 'archived',
	abandoned = 'abandoned'
}

//statusType to display string
export const statusTypeDisplay = {
	[statusType.draft]: 'Draft',
	[statusType.completed]: 'Completed',
	[statusType.inProgress]: 'In Progress',
	[statusType.archived]: 'Archived',
	[statusType.abandoned]: 'Abandoned'
};

//how to use:
//statusTypeDisplay[statusType.draft] //returns 'Draft'
