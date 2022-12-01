import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';
import { writable } from 'svelte/store';

import type { TodoDisplayChange, TodoItemChange, TodoTabChange } from '.';

export type TodoHistoryData =
	| (TodoItemChange & { historyType: 'item' })
	| (TodoTabChange & { historyType: 'tab' })
	| (TodoDisplayChange & { historyType: 'display' });
export const createTodoHistory = () => {
	const { subscribe, set, update } = writable<TodoHistoryData[]>([]);

	const Item = {
		addAdded: (item: TodoItemData) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					new: item,
					type: 'added',
					historyType: 'item',
					date: new Date(),
					hidden: false,
					id: history.length
				};
				return [newHistory, ...history];
			});
		},
		addChanged: (data: { old: TodoItemData; new: TodoItemData }) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					old: data.old,
					new: data.new,
					type: 'changed',
					date: new Date(),
					hidden: false,
					historyType: 'item',
					id: history.length
				};

				return [newHistory, ...history];
			});
		},

		addRemoved: (item: TodoItemData) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					old: item,
					type: 'removed',
					date: new Date(),
					hidden: false,
					historyType: 'item',
					id: history.length
				};
				return [newHistory, ...history];
			});
		}
	};

	const Tab = {
		addAdded: (tab: TodoTabData) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					new: tab,
					type: 'added',
					date: new Date(),
					hidden: false,
					historyType: 'tab',
					id: history.length
				};
				return [newHistory, ...history];
			});
		},
		addChanged: (data: { old: TodoTabData; new: TodoTabData }) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					old: data.old,
					new: data.new,
					type: 'changed',
					date: new Date(),
					hidden: false,
					historyType: 'tab',
					id: history.length
				};
				return [newHistory, ...history];
			});
		},
		addRemoved: (tab: TodoTabData) => {
			update(function (history) {
				const newHistory: TodoHistoryData = {
					old: tab,
					type: 'removed',
					date: new Date(),
					hidden: false,
					historyType: 'tab',
					id: history.length
				};
				return [newHistory, ...history];
			});
		}
	};

	const Display = {
		addChanged: (data: { old: TodoDisplayData; new: TodoDisplayData }) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					old: data.old,
					new: data.new,
					type: 'changed',
					date: new Date(),
					hidden: false,
					historyType: 'display',
					id: history.length
				};
				return [newHistory, ...history];
			});
		},

		addRemoved: (display: TodoDisplayData) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					old: display,
					type: 'removed',
					date: new Date(),
					hidden: false,
					historyType: 'display',
					id: history.length
				};
				return [newHistory, ...history];
			});
		},
		addAdded: (display: TodoDisplayData) => {
			update((history) => {
				const newHistory: TodoHistoryData = {
					new: display,
					type: 'added',
					date: new Date(),
					hidden: false,
					historyType: 'display',
					id: history.length
				};

				return [newHistory, ...history];
			});
		}
	};

	return {
		subscribe,
		set,
		update,
		Item,
		Tab,
		Display
	};
};

export const TodoHistory = createTodoHistory();
