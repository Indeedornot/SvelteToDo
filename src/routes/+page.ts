import type { TodoDisplayData } from '$lib/models/TodoData';
import { getTodoDisplays, postTodoDisplay } from '$lib/prisma/apiCalls';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	let todos: TodoDisplayData[] = await getTodoDisplays();
	if (!todos) {
		let todo: TodoDisplayData = { id: -1, title: 'ProjectName', todoTabs: [], sortOrder: 0 };
		todo = await postTodoDisplay(todo);
		todos = [todo];
	}

	return {
		todos
	};
};
