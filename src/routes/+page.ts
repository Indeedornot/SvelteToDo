import { error } from '@sveltejs/kit';

import { browser } from '$app/environment';
import { createTodoDisplay, getTodoDisplays } from '$lib/apiCalls/TodoActions';
import type { TodoDisplayCreateData, TodoDisplayData } from '$lib/models/TodoData';

import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	let todos: TodoDisplayData[] = [];
	if (browser) {
		console.log('load');

		try {
			todos = await getTodoDisplays().then(async (data) => {
				if (data.length !== 0) return data;

				const todo: TodoDisplayCreateData = { title: 'ProjectName', sortOrder: 0, todoTabs: [] };
				const newData = await createTodoDisplay(todo).catch((err) => Promise.reject(err));
				return [newData];
			});
		} catch (err) {
			throw error(500, {
				message: 'Failed to load todos'
			});
		}

		return { todos: todos };
	}
};
