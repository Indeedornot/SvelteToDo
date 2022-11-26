import { writable } from 'svelte/store';

import type { TodoItemChange, TodoItemHistoryData } from '.';

const createTodoItemHistory = () => {
	const { subscribe, set, update } = writable<TodoItemChange[]>([]);

	const change = (data: { old: TodoItemHistoryData; new: TodoItemHistoryData }) => {
		const newHist: TodoItemChange = { ...data, type: 'changed', date: new Date() };
		// const index = history.findIndex((item) => item.new?.id === data.id);
		// if (index !== -1) {
		// 	newHist.old = history[index].new;
		// 	return [...history, newHist];
		// }

		// getTodoItem(data.id)
		// 	.then((data) => {
		// 		newHist.old = data;
		// 	})
		// 	.catch();
		update((history) => [...history, newHist]);
		console.log('TodoItemHistory: change', newHist);
	};

	const remove = (data: TodoItemHistoryData) => {
		const newHist: TodoItemChange = { old: data, type: 'removed', date: new Date() };
		update((history) => [...history, newHist]);
		console.log('TodoItemHistory: remove', newHist);
	};

	const add = (data: TodoItemHistoryData) => {
		const newHist: TodoItemChange = { new: data, type: 'added', date: new Date() };
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
