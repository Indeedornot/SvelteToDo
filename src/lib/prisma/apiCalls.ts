import type { Optional } from '$lib/helpers/optionalProperty';
import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';
const host = 'http://localhost:5173';

const getIp = (relativePath: string): string => {
	return host + relativePath;
};

//*Standard
//**Display */
export const getTodoDisplay = async (): Promise<TodoDisplayData> => {
	return fetch(getIp('/api/todoDisplay'), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
};
export const postTodoDisplay = async (data: Optional<TodoDisplayData, 'todoTabs'>): Promise<TodoDisplayData> => {
	return fetch(getIp('/api/todoDisplay'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => response.json());
};

//**Tabs */
export const getTodoTab = async (id: number): Promise<TodoTabData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoTab/${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
};
export const getTodoTabs = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	const queryParam = new URLSearchParams({ todoDisplayId: todoDisplayId.toString() });
	return fetch(getIp(`/api/todoTab/${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
};
export const postTodoTab = async (data: Optional<TodoTabData, 'todoItems'>): Promise<TodoTabData> => {
	return fetch(getIp('/api/todoTab'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => response.json());
};
export const deleteTodoTab = async (id: number): Promise<void> => {
	await fetch(getIp(`/api/todoTab`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	});
};

//**Items */
export const getTodoItem = async (id: number): Promise<TodoItemData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoItem/${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
};
export const getTodoItems = async (todoTabId: number): Promise<TodoItemData[]> => {
	const queryParam = new URLSearchParams({ todoTabId: todoTabId.toString() });
	return fetch(getIp(`/api/todoItem/${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
};
export const postTodoItem = async (data: TodoItemData): Promise<TodoItemData> => {
	return fetch(getIp('/api/todoItem'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => response.json());
};
export const deleteTodoItem = async (id: number): Promise<void> => {
	await fetch(getIp(`/api/todoItem`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	});
};

//*Bulk
//**Items */
export const postTodoItems = async (data: TodoItemData[]): Promise<TodoItemData[]> => {
	const result: TodoItemData[] = [];
	for (const item of data) {
		result.push(await postTodoItem(item));
	}

	return result;
};
export const deleteTodoItems = async (data: TodoItemData[]): Promise<void> => {
	for (const item of data) {
		await deleteTodoItem(item.id);
	}
};

//**Tabs */
export const postTodoTabs = async (data: TodoTabData[]): Promise<TodoTabData[]> => {
	const result: TodoTabData[] = [];
	for (const item of data) {
		result.push(await postTodoTab(item));
	}

	return result;
};
export const deleteTodoTabs = async (data: TodoTabData[]): Promise<void> => {
	for (const item of data) {
		await deleteTodoTab(item.id);
	}
};
