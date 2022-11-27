import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';
import { isSynced } from '$lib/stores/Sync';
import { TodoDisplayHistory, TodoItemHistory, TodoTabHistory } from '$lib/stores/Todo';

import {
	deleteTodoDisplayApi,
	deleteTodoItemApi,
	deleteTodoTabApi,
	getTodoDisplayApi,
	getTodoDisplaysApi,
	getTodoItemApi,
	getTodoItemsApi,
	getTodoTabApi,
	getTodoTabsApi,
	postTodoDisplayApi,
	postTodoItemApi,
	postTodoTabApi
} from './apiCalls';

//displays
export const getTodoDisplays = async (): Promise<TodoDisplayData[]> => {
	return getTodoDisplaysApi().catch((error) => {
		isSynced.set(false);
		return Promise.reject(error);
	});
};

export const getTodoDisplay = async (id: number): Promise<TodoDisplayData> => {
	return getTodoDisplayApi(id).catch((error) => {
		isSynced.set(false);
		return Promise.reject(error);
	});
};

export const getTodoTabs = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	return getTodoTabsApi(todoDisplayId).catch((error) => {
		isSynced.set(false);
		return Promise.reject(error);
	});
};

export const postTodoDisplay = async (data: TodoDisplayData, history = false): Promise<TodoDisplayData> => {
	if (data.id !== -1) {
		getTodoDisplayApi(data.id)
			.then((todoDisplay) => {
				history && TodoDisplayHistory.addChanged({ old: todoDisplay, new: data });
			})
			.catch(() => {
				isSynced.set(false);
			});
	}
	return postTodoDisplayApi(data)
		.then((postedDisplay) => {
			if (data.id === -1) {
				history && TodoDisplayHistory.addAdded(postedDisplay);
			}
			return postedDisplay;
		})
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};

export const deleteTodoDisplay = async (data: TodoDisplayData, history = false): Promise<void> => {
	return deleteTodoDisplayApi(data.id)
		.then(() => {
			history && TodoDisplayHistory.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};

//tabs
export const getTodoTab = async (id: number): Promise<TodoTabData> => {
	return getTodoTabApi(id).catch((error) => {
		isSynced.set(false);
		return Promise.reject(error);
	});
};
export const postTodoTab = async (data: TodoTabData, history = false): Promise<TodoTabData> => {
	if (data.id !== -1) {
		getTodoTabApi(data.id)
			.then((todoTab) => {
				history && TodoTabHistory.addChanged({ old: todoTab, new: data });
			})
			.catch(() => {
				isSynced.set(false);
			});
	}

	return postTodoTabApi(data)
		.then((postedTab) => {
			if (data.id === -1) {
				history && TodoTabHistory.addAdded(postedTab);
			}

			return postedTab;
		})
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};
export const deleteTodoTab = async (data: TodoTabData, history = false): Promise<void> => {
	return deleteTodoTabApi(data.id)
		.then(() => {
			history && TodoTabHistory.addRemoved(data);
			console.log('deleteTodoTab', data);
		})
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};

//items
export const getTodoItems = async (todoTabId: number): Promise<TodoItemData[]> => {
	return getTodoItemsApi(todoTabId).catch((error) => {
		isSynced.set(false);
		return Promise.reject(error);
	});
};

export const getTodoItem = async (id: number): Promise<TodoItemData> => {
	return getTodoItemApi(id)
		.then((data) => data)
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};

export const postTodoItem = async (data: TodoItemData, history = false): Promise<TodoItemData> => {
	if (data.id !== -1) {
		getTodoItemApi(data.id)
			.then((todoItem) => {
				history && TodoItemHistory.addChanged({ old: todoItem, new: data });
			})
			.catch(() => {
				isSynced.set(false);
			});
	}
	return postTodoItemApi(data)
		.then((postedItem) => {
			if (data.id === -1) {
				history && TodoItemHistory.addAdded(postedItem);
			}
			return postedItem;
		})
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};

export const deleteTodoItem = async (data: TodoItemData, history = false): Promise<void> => {
	return deleteTodoItemApi(data.id)
		.then(() => {
			history && TodoItemHistory.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set(false);
			return Promise.reject(error);
		});
};
