import { writable } from 'svelte/store';

import type { TodoTabChange, TodoTabHistoryData } from '.';

const createTodoTabHistory = () => {
	const { subscribe, set, update } = writable<TodoTabChange[]>([]);

	const change = (data: { old: TodoTabHistoryData; new: TodoTabHistoryData }) => {
		const newHist: TodoTabChange = { ...data, type: 'changed', date: new Date() };
		// const index = history.findIndex((item) => item.new?.id === data.id);
		// if (index !== -1) {
		// 	newHist.old = history[index].new;
		// 	return [...history, newHist];
		// }

		// getTodoTab(data.id)
		// 	.then((data) => {
		// 		newHist.old = data;
		// 	})
		// 	.catch();
		update((history) => [...history, newHist]);
		console.log('TodoTabHistory: change', newHist);
	};

	const remove = (data: TodoTabHistoryData) => {
		const newHist: TodoTabChange = { old: data, type: 'removed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoTabHistory: remove', newHist);
	};

	const add = (data: TodoTabHistoryData) => {
		const newHist: TodoTabChange = { new: data, type: 'added', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoTabHistory: add', newHist);
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
