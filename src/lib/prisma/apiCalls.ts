import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';
import type { TodoDisplayApiData, TodoItemApiData, TodoTabApiData } from '$lib/prisma/TodoApiData';

const host = 'http://localhost:5173';
const getIp = (relativePath: string): string => {
	return host + relativePath;
};

//*Standard
//**Display */
export const getTodoDisplays = async (): Promise<TodoDisplayData[]> => {
	return fetch(getIp('/api/todoDisplay'), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const getTodoDisplay = async (id: number): Promise<TodoDisplayData> => {
	return fetch(getIp(`/api/todoDisplay/${id}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const postTodoDisplay = async (body: TodoDisplayApiData): Promise<TodoDisplayData> => {
	return fetch(getIp('/api/todoDisplay'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then((response) => parseResponse(response));
};

export const deleteTodoDisplay = async (id: number): Promise<void> => {
	return fetch(getIp(`/api/todoDisplay`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	}).then((response) => parseResponse(response));
};

//**Tabs */
export const getTodoTab = async (id: number): Promise<TodoTabData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoTab/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const getTodoTabs = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	const queryParam = new URLSearchParams({ todoDisplayId: todoDisplayId.toString() });
	return fetch(getIp(`/api/todoTab/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const postTodoTab = async (body: TodoTabApiData): Promise<TodoTabData> => {
	return fetch(getIp('/api/todoTab'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then((response) => parseResponse(response));
};
export const deleteTodoTab = async (id: number): Promise<void> => {
	await fetch(getIp(`/api/todoTab`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	}).then((response) => parseResponse(response));
};

//**Items */
export const getTodoItem = async (id: number): Promise<TodoItemData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoItem/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};
export const getTodoItems = async (todoTabId: number): Promise<TodoItemData[]> => {
	const queryParam = new URLSearchParams({ todoTabId: todoTabId.toString() });
	return fetch(getIp(`/api/todoItem/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};
export const postTodoItem = async (body: TodoItemApiData): Promise<TodoItemData> => {
	return fetch(getIp('/api/todoItem'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then((response) => parseResponse(response));
};

export const deleteTodoItem = async (id: number): Promise<void> => {
	await fetch(getIp(`/api/todoItem`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	}).then((response) => parseResponse(response));
};

const parseResponse = async <T>(response: Response): Promise<T> => {
	const isJson = response.headers.get('content-type')?.includes('application/json');
	const data = isJson ? await response.json() : null;

	// check for error response
	if (!response.ok) {
		// get error message from body or default to response status
		const error = (data && data.message) || response.status;
		return Promise.reject(error);
	}
	return data;
};
