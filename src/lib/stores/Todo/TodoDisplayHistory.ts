import type { TodoDisplayData } from '$lib/models/TodoData';
import { writable } from 'svelte/store';

import type { TodoDisplayChange } from '.';

export const createTodoDisplayHistory = () => {
	const { subscribe, set, update } = writable<TodoDisplayChange[]>([]);

	const change = (data: { old: TodoDisplayData; new: TodoDisplayData }) => {
		const newHist: TodoDisplayChange = {
			old: { ...data.old },
			new: { ...data.new },
			type: 'changed',
			date: new Date()
		};
		update((history) => [...history, newHist]);
		console.log('TodoDisplayHistory: change', newHist);
	};

	const remove = (data: TodoDisplayData) => {
		const newHist: TodoDisplayChange = { old: { ...data }, type: 'removed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoDisplayHistory: remove', newHist);
	};

	const add = (data: TodoDisplayData) => {
		const newHist: TodoDisplayChange = { new: { ...data }, type: 'added', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoDisplayHistory: add', newHist);
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

export const TodoDisplayHistory = createTodoDisplayHistory();
