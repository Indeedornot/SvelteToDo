import { error } from '@sveltejs/kit';

import type { TodoDisplayData } from '$lib/models/TodoData';
import { trpc } from '$lib/trpc/client';

import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	let todos: TodoDisplayData[];
	return await trpc(event)
		.display.getAll.query()
		.then(async (data) => {
			todos = data;
			if (todos.length !== 0) return { todos };

			const todo: TodoDisplayData = { id: -1, title: 'ProjectName', todoTabs: [], sortOrder: 0 };
			return trpc()
				.display.create.query(todo)
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
