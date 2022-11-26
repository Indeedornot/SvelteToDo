//#region Base
type TodoHistoryBase = {
	date: Date;
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

//DISPLAY
export type TodoDisplayHistoryData = {
	id: number;
	title: string;
};
export type TodoDisplayChange = TodoHistoryAll<TodoDisplayHistoryData>;

//ITEM
export type TodoItemHistoryData = {
	id: number;
	title: string;
	status: string;
	todoTabId: number;
};
export type TodoItemChange = TodoHistoryAll<TodoItemHistoryData>;

//TAB
export type TodoTabHistoryData = {
	id: number;
	title: string;
	todoDisplayId: number;
};
export type TodoTabChange = TodoHistoryAll<TodoTabHistoryData>;

//SAMPLE
type TodoHistorySample<T> = {
	add: TodoHistoryAdd<T>;
	remove: TodoHistoryRemove<T>;
	change: TodoHistoryChange<T>[];
};

const TodoItemHistorySample: TodoHistorySample<TodoItemHistoryData> = {
	change: [
		// unchanged status
		{
			old: {
				id: 1,
				title: 'test',
				status: 'test',
				todoTabId: 1
			},
			new: {
				id: 1,
				title: 'testNew',
				status: 'test',
				todoTabId: 1
			},
			type: 'changed',
			date: new Date()
		},
		// unchanged title
		{
			old: {
				id: 1,
				title: 'test',
				status: 'test',
				todoTabId: 1
			},
			new: {
				id: 1,
				title: 'test',
				status: 'testNew',
				todoTabId: 1
			},
			type: 'changed',
			date: new Date()
		},

		// changed all
		{
			old: {
				id: 1,
				title: 'test',
				status: 'test',
				todoTabId: 1
			},
			new: {
				id: 1,
				title: 'testNew',
				status: 'testNew',
				todoTabId: 1
			},
			type: 'changed',
			date: new Date()
		},
		// unchanged
		{
			old: {
				id: 1,
				title: 'test',
				status: 'test',
				todoTabId: 1
			},
			new: {
				id: 1,
				title: 'test',
				status: 'test',
				todoTabId: 1
			},
			type: 'changed',
			date: new Date()
		}
	],
	// removed
	remove: {
		old: {
			id: 1,
			title: 'test',
			status: 'test',
			todoTabId: 1
		},
		type: 'removed',
		date: new Date()
	},
	// added
	add: {
		new: {
			id: 1,
			title: 'testNew',
			status: 'testNew',
			todoTabId: 1
		},
		type: 'added',
		date: new Date()
	}
};

const TodoTabHistorySample: TodoHistorySample<TodoTabHistoryData> = {
	change: [
		// changed
		{
			old: {
				id: 1,
				title: 'test',
				todoDisplayId: 1
			},
			new: {
				id: 1,
				title: 'testNew',
				todoDisplayId: 1
			},
			type: 'changed',
			date: new Date()
		},
		//unchanged
		{
			old: {
				id: 1,
				title: 'test',
				todoDisplayId: 1
			},
			new: {
				id: 1,
				title: 'test',
				todoDisplayId: 1
			},
			type: 'changed',
			date: new Date()
		}
	],
	// removed
	remove: {
		old: {
			id: 1,
			title: 'test',
			todoDisplayId: 1
		},
		type: 'removed',
		date: new Date()
	},
	// added
	add: {
		new: {
			id: 1,
			title: 'testNew',
			todoDisplayId: 1
		},
		type: 'added',
		date: new Date()
	}
};

const TodoDisplayHistorySample: TodoHistorySample<TodoDisplayHistoryData> = {
	change: [
		// changed
		{
			old: {
				id: 1,
				title: 'test'
			},
			new: {
				id: 1,
				title: 'testNew'
			},
			type: 'changed',
			date: new Date()
		},
		//unchanged
		{
			old: {
				id: 1,
				title: 'test'
			},
			new: {
				id: 1,
				title: 'test'
			},
			type: 'changed',
			date: new Date()
		}
	],
	// removed
	remove: {
		old: {
			id: 1,
			title: 'test'
		},
		type: 'removed',
		date: new Date()
	},
	// added
	add: {
		new: {
			id: 1,
			title: 'testNew'
		},
		type: 'added',
		date: new Date()
	}
};
