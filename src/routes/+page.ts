import type { PageLoad } from './$types';
import type { TodoDisplayData } from '$lib/models/TodoData';

export const load: PageLoad = async ({ fetch }) => {
	const data = await fetch('/api/');
	const todos: TodoDisplayData = await data.json();

	return {
		todos
	};
};
