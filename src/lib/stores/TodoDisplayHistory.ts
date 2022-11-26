import { writable } from 'svelte/store';

import type { TodoDisplayChange, TodoDisplayHistoryData } from '.';

export const createTodoDisplayHistory = () => {
	const { subscribe, set, update } = writable<TodoDisplayChange[]>([]);

	const change = (data: { old: TodoDisplayHistoryData; new: TodoDisplayHistoryData }) => {
		const newHist: TodoDisplayChange = { ...data, type: 'changed', date: new Date() };
		// const index = history.findIndex((item) => item.new?.id === data.id);
		// if (index !== -1) {
		// 	newHist.old = history[index].new;
		// 	return [...history, newHist];
		// }

		// getTodoDisplay(data.id)
		// 	.then((data) => {
		// 		newHist.old = data;
		// 	})
		// 	.catch();
		update((history) => [...history, newHist]);
		console.log('TodoDisplayHistory: change', newHist);
	};

	const remove = (data: TodoDisplayHistoryData) => {
		const newHist: TodoDisplayChange = { old: data, type: 'removed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoDisplayHistory: remove', newHist);
	};

	const add = (data: TodoDisplayHistoryData) => {
		const newHist: TodoDisplayChange = { new: data, type: 'added', date: new Date() };
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
