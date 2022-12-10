import { browser } from '$app/environment';
import type {
	TodoDisplayCreateData,
	TodoDisplayData,
	TodoItemCreateData,
	TodoItemData,
	TodoTabCreateData,
	TodoTabData
} from '$lib/models/TodoData';
import { isSynced } from '$lib/stores/Sync';
import { TodoHistory } from '$lib/stores/Todo/TodoHistory';

import * as dbCalls from './db/dbutilities';

export const middleware = () => {
	if(!browser) return {};
	return this; 
}

export const getTodoDisplays = async (): Promise<TodoDisplayData[]> => {
	return dbCalls.getTodoDisplays(true).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const getTodoDisplay = async (id: string): Promise<TodoDisplayData> => {
	return dbCalls.getTodoDisplay(id, true).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const postTodoDisplay = async (data: TodoDisplayData, history = false): Promise<void> => {
	if (history) {
		await dbCalls
			.getTodoDisplay(data.id, false)
			.then((todoDisplay) => {
				TodoHistory.Display.addChanged({ old: todoDisplay, new: data });
			})
			.catch((error) => {
				isSynced.set({ isSync: false, error: error });
				return Promise.reject(error);
			});
	}

	return dbCalls.updateTodoDisplay(data).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const createTodoDisplay = async (data: TodoDisplayCreateData, history = false): Promise<TodoDisplayData> => {
	return dbCalls
		.addTodoDisplay(data)
		.then((postedDisplay) => {
			history && TodoHistory.Display.addAdded(postedDisplay);
			return postedDisplay;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const deleteTodoDisplay = async (data: TodoDisplayData, history = false): Promise<void> => {
	return dbCalls
		.deleteTodoDisplay(data.id)
		.then(() => {
			history && TodoHistory.Display.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

//tabs
export const getTodoTab = async (id: string): Promise<TodoTabData> => {
	return dbCalls.getTodoTab(id, true).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const getTodoTabs = async (todoDisplayId: string): Promise<TodoTabData[]> => {
	return dbCalls.getTodoTabsByDisplay(todoDisplayId, true).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const postTodoTab = async (data: TodoTabData, history = false): Promise<void> => {
	if (history) {
		await dbCalls
			.getTodoTab(data.id, false)
			.then((todoTab) => {
				TodoHistory.Tab.addChanged({ old: todoTab, new: data });
			})
			.catch((error) => {
				isSynced.set({ isSync: false, error: error });
				return Promise.reject(error);
			});
	}

	return dbCalls.updateTodoTab(data).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const createTodoTab = async (data: TodoTabCreateData, history = false): Promise<TodoTabData> => {
	return dbCalls
		.addTodoTab(data)
		.then((postedTab) => {
			history && TodoHistory.Tab.addAdded(postedTab);
			return postedTab;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const deleteTodoTab = async (data: TodoTabData, history = false): Promise<void> => {
	return dbCalls
		.deleteTodoTab(data.id)
		.then(() => {
			history && TodoHistory.Tab.addRemoved(data);
			console.log('deleteTodoTab', data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

//items
export const getTodoItems = async (todoTabId: string): Promise<TodoItemData[]> => {
	return dbCalls.getTodoItemsByTab(todoTabId).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const getTodoItem = async (id: string): Promise<TodoItemData> => {
	return dbCalls.getTodoItem(id).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const createTodoItem = async (data: TodoItemCreateData, history = false): Promise<TodoItemData> => {
	return dbCalls
		.addTodoItem(data)
		.then((postedItem) => {
			history && TodoHistory.Item.addAdded(postedItem);
			return postedItem;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoItem = async (data: TodoItemData, history = false): Promise<void> => {
	if (history) {
		await dbCalls
			.getTodoItem(data.id)
			.then((todoItem) => {
				TodoHistory.Item.addChanged({ old: todoItem, new: data });
			})
			.catch((error) => {
				isSynced.set({ isSync: false, error: error });
				return Promise.reject(error);
			});
	}

	return dbCalls.updateTodoItem(data).catch((error) => {
		isSynced.set({ isSync: false, error: error });
		return Promise.reject(error);
	});
};

export const deleteTodoItem = async (data: TodoItemData, history = false): Promise<void> => {
	return dbCalls
		.deleteTodoItem(data.id)
		.then(() => {
			history && TodoHistory.Item.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};
