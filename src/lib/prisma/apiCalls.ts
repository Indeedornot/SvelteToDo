import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';
import type { TodoDisplayApiData, TodoItemApiData, TodoTabApiData } from '$lib/prisma/TodoApiData';

const host = 'http://localhost:5173';
const getIp = (relativePath: string): string => {
	return host + relativePath;
};

//*Standard
//**Display */
export const getTodoDisplay = async (): Promise<TodoDisplayData> => {
	const response: TodoDisplayApiData = await fetch(getIp('/api/todoDisplay'), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());

	return response as TodoDisplayData;
};
export const postTodoDisplay = async (data: TodoDisplayApiData): Promise<TodoDisplayData> => {
	const response: TodoDisplayApiData = await fetch(getIp('/api/todoDisplay'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => response.json());

	return response as TodoDisplayData;
};

//**Tabs */
export const getTodoTab = async (id: number): Promise<TodoTabData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	const response = await fetch(getIp(`/api/todoTab/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());

	return response as TodoTabData;
};

export const getTodoTabs = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	const queryParam = new URLSearchParams({ todoDisplayId: todoDisplayId.toString() });
	const response: TodoTabApiData[] = await fetch(getIp(`/api/todoTab/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
	return response as TodoTabData[];
};

export const postTodoTab = async (data: TodoTabApiData): Promise<TodoTabData> => {
	const response: TodoTabApiData = await fetch(getIp('/api/todoTab'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => response.json());

	return response as TodoTabData;
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
	const response: TodoItemApiData = await fetch(getIp(`/api/todoItem/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());

	return response as TodoItemData;
};
export const getTodoItems = async (todoTabId: number): Promise<TodoItemData[]> => {
	const queryParam = new URLSearchParams({ todoTabId: todoTabId.toString() });
	const response: TodoItemApiData[] = await fetch(getIp(`/api/todoItem/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => response.json());
	return response as TodoItemData[];
};
export const postTodoItem = async (data: TodoItemApiData): Promise<TodoItemData> => {
	const response: TodoItemApiData = await fetch(getIp('/api/todoItem'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => response.json());

	return response as TodoItemData;
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
export const deleteTodoItems = async (data: { id: number }[]): Promise<void> => {
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
export const deleteTodoTabs = async (data: { id: number }[]): Promise<void> => {
	for (const item of data) {
		await deleteTodoTab(item.id);
	}
};
