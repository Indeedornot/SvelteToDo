import type { TodoDisplayData } from '$lib/models/TodoData';
import { getTodoDisplay, postTodoDisplay } from '$lib/prisma/apiCalls';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	let todos: TodoDisplayData = await getTodoDisplay();
	if (!todos) {
		todos = { id: -1, title: 'ProjectName', todoTabs: [] };
		todos = await postTodoDisplay(todos);
	}

	return {
		todos
	};
};
