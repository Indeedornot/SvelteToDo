import type { TodoTabData } from '$lib/models/TodoData';
import { writable } from 'svelte/store';

import type { TodoTabChange } from '.';

const createTodoTabHistory = () => {
	const { subscribe, set, update } = writable<TodoTabChange[]>([]);

	const change = (data: { old: TodoTabData; new: TodoTabData }) => {
		const newHist: TodoTabChange = { old: { ...data.old }, new: { ...data.new }, type: 'changed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoTabHistory: change', newHist);
	};

	const remove = (data: TodoTabData) => {
		const newHist: TodoTabChange = { old: { ...data }, type: 'removed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoTabHistory: remove', newHist);
	};

	const add = (data: TodoTabData) => {
		const newHist: TodoTabChange = { new: { ...data }, type: 'added', date: new Date() };
		console.log('TodoTabHistory: add', newHist);

		update((history) => [...history, newHist]);
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

export const TodoTabHistory = createTodoTabHistory();
