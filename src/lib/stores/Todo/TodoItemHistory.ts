import type { TodoItemData } from '$lib/models/TodoData';
import { writable } from 'svelte/store';

import type { TodoItemChange } from '.';

const createTodoItemHistory = () => {
	const { subscribe, set, update } = writable<TodoItemChange[]>([]);

	const change = (data: { old: TodoItemData; new: TodoItemData }) => {
		const newHist: TodoItemChange = { old: { ...data.old }, new: { ...data.new }, type: 'changed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoItemHistory: change', newHist);
	};

	const remove = (data: TodoItemData) => {
		const newHist: TodoItemChange = { old: { ...data }, type: 'removed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoItemHistory: remove', newHist);
	};

	const add = (data: TodoItemData) => {
		const newHist: TodoItemChange = { new: { ...data }, type: 'added', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoItemHistory: add', newHist);
	};

	return {
		subscribe,
		set,
		update,
		addAdded: add,
		addRemoved: remove,
		addChanged: change
	};
};

export const TodoItemHistory = createTodoItemHistory();
