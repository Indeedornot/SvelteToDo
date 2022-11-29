import type { TodoDisplayApiData, TodoItemApiData, TodoTabApiData } from '$lib/apiCalls/TodoApiData';
import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';

const host = 'http://192.168.8.104:5173';
const getIp = (relativePath: string): string => {
	return host + relativePath;
};

//*Standard
//**Display */
export const getTodoDisplaysApi = async (): Promise<TodoDisplayData[]> => {
	return fetch(getIp('/api/todoDisplay'), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const getTodoDisplayApi = async (id: number): Promise<TodoDisplayData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoDisplay/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const postTodoDisplayApi = async (body: TodoDisplayApiData): Promise<TodoDisplayData> => {
	return fetch(getIp('/api/todoDisplay'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then((response) => parseResponse(response));
};

export const deleteTodoDisplayApi = async (id: number): Promise<void> => {
	return fetch(getIp(`/api/todoDisplay`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	}).then((response) => parseResponse(response));
};

//**Tabs */
export const getTodoTabApi = async (id: number): Promise<TodoTabData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoTab/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const getTodoTabsApi = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	const queryParam = new URLSearchParams({ todoDisplayId: todoDisplayId.toString() });
	return fetch(getIp(`/api/todoTab/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};

export const postTodoTabApi = async (body: TodoTabApiData): Promise<TodoTabData> => {
	return fetch(getIp('/api/todoTab'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then((response) => parseResponse(response));
};
export const deleteTodoTabApi = async (id: number): Promise<void> => {
	await fetch(getIp(`/api/todoTab`), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	}).then((response) => {
		console.log(response);
		return parseResponse(response);
	});
};

//**Items */
export const getTodoItemApi = async (id: number): Promise<TodoItemData> => {
	const queryParam = new URLSearchParams({ id: id.toString() });
	return fetch(getIp(`/api/todoItem/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};
export const getTodoItemsApi = async (todoTabId: number): Promise<TodoItemData[]> => {
	const queryParam = new URLSearchParams({ todoTabId: todoTabId.toString() });
	return fetch(getIp(`/api/todoItem/?${queryParam}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) => parseResponse(response));
};
export const postTodoItemApi = async (body: TodoItemApiData): Promise<TodoItemData> => {
	return fetch(getIp('/api/todoItem'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then((response) => parseResponse(response));
};

export const deleteTodoItemApi = async (id: number): Promise<void> => {
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
		const error = (data && data.message) || `${response.status}: ${response.statusText}`;
		return Promise.reject(error);
	}
	return data;
};
