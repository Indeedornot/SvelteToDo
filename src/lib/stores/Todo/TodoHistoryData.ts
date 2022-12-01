import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';

//#region Base
type TodoHistoryBase = {
	date: Date;
	hidden: boolean;
	id: number;
};

type TodoHistoryChange<T> = TodoHistoryBase & {
	type: 'changed';
	old: T;
	new: T;
};

type TodoHistoryAdd<T> = TodoHistoryBase & {
	type: 'added';
	new: T;
};

type TodoHistoryRemove<T> = TodoHistoryBase & {
	type: 'removed';
	old: T;
};

export type TodoHistoryAll<T> = TodoHistoryChange<T> | TodoHistoryAdd<T> | TodoHistoryRemove<T>;
//#endregion

// //DISPLAY
// export type TodoDisplayHistoryData = {
// 	id: number;
// 	title: string;
// };
export type TodoDisplayChange = TodoHistoryAll<TodoDisplayData>;

// //ITEM
// export type TodoItemHistoryData = {
// 	id: number;
// 	title: string;
// 	status: string;
// 	todoTabId: number;
// };
export type TodoItemChange = TodoHistoryAll<TodoItemData>;

// //TAB
// export type TodoTabHistoryData = {
// 	id: number;
// 	title: string;
// 	todoDisplayId: number;
// };
export type TodoTabChange = TodoHistoryAll<TodoTabData>;
