import { error } from '@sveltejs/kit';

import { getTodoDisplays, postTodoDisplay } from '$lib/apiCalls/TodoActions';
import type { TodoDisplayData } from '$lib/models/TodoData';

import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	let todos: TodoDisplayData[];
	return await getTodoDisplays()
		.then(async (data) => {
			todos = data;
			if (todos.length !== 0) return { todos };

			const todo: TodoDisplayData = { id: -1, title: 'ProjectName', todoTabs: [], sortOrder: 0 };
			return postTodoDisplay(todo)
				.then((data) => {
					todos = [data];
					return { todos };
				})
				.catch((err) => Promise.reject(err));
		})
		.catch((err) => {
			console.log(err);

			throw error(500, {
				message: 'Failed to load todos'
			});
		});
};
