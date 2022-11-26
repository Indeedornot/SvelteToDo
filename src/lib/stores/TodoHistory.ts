import { type Readable, derived } from 'svelte/store';

import {
	type TodoDisplayChange,
	TodoDisplayHistory,
	type TodoItemChange,
	TodoItemHistory,
	type TodoTabChange,
	TodoTabHistory
} from '.';

export type TodoHistoryData =
	| (TodoItemChange & { historyType: 'item' })
	| (TodoTabChange & { historyType: 'tab' })
	| (TodoDisplayChange & { historyType: 'display' });
export const TodoHistory: Readable<TodoHistoryData[]> = derived(
	[TodoDisplayHistory, TodoTabHistory, TodoItemHistory],
	($values) => {
		const [todoDisplayHistory, todoTabHistory, todoItemHistory] = $values;
		const disps: (TodoDisplayChange & { historyType: 'display' })[] = todoDisplayHistory.map((change) => ({
			...change,
			historyType: 'display'
		}));
		const tabs: (TodoTabChange & { historyType: 'tab' })[] = todoTabHistory.map((change) => ({
			...change,
			historyType: 'tab'
		}));
		const items: (TodoItemChange & { historyType: 'item' })[] = todoItemHistory.map((change) => ({
			...change,
			historyType: 'item'
		}));
		return [...disps, ...tabs, ...items];
	}
);
