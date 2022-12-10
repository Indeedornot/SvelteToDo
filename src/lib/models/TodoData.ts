export type TodoDisplayData = {
	id: string;
	title: string;
	todoTabs: TodoTabData[];
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
};

export type TodoTabData = {
	id: string;
	title: string;
	sortOrder: number;
	todoDisplayId: string;
	todoItems: TodoItemData[];
	createdAt: Date;
	updatedAt: Date;
	hidden?: boolean;
};

export type TodoItemData = {
	id: string;
	title: string;
	sortOrder: number;
	status: statusType;
	todoTabId: string;
	createdAt: Date;
	updatedAt: Date;
	collapsed: boolean;
	hidden?: boolean;
};

export type TodoDisplayCreateData = {
	title: string;
	sortOrder: number;
	todoTabs?: TodoTabCreateData[];
};

export type TodoTabCreateData = {
	title: string;
	sortOrder: number;
	todoItems?: TodoItemCreateData[];
	todoDisplayId: string;
};

export type TodoItemCreateData = {
	title: string;
	sortOrder: number;
	status: statusType;
	collapsed: boolean;
	todoTabId: string;
};

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
