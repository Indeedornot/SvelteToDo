import type { TodoDisplayData, TodoItemData, TodoTabData } from '$lib/models/TodoData';
import { isSynced } from '$lib/stores/Sync';
import { TodoDisplayHistory, TodoItemHistory, TodoTabHistory } from '$lib/stores/Todo';
import { trpc } from '$lib/trpc/client';

export const getTodoDisplays = async (): Promise<TodoDisplayData[]> => {
	return trpc()
		.display.getAll.query()
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const getTodoDisplay = async (id: number): Promise<TodoDisplayData> => {
	return trpc()
		.display.getSingle.query(id)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const getTodoTabs = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	return trpc()
		.tab.getByDisplay.query(todoDisplayId)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoDisplay = async (data: TodoDisplayData, history = false): Promise<TodoDisplayData> => {
	await trpc()
		.display.getSingle.query(data.id)
		.then((todoDisplay) => {
			history && TodoDisplayHistory.addChanged({ old: todoDisplay, new: data });
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
	return trpc()
		.display.update.query(data)
		.then((postedDisplay) => postedDisplay)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const createTodoDisplay = async (data: TodoDisplayData, history = false): Promise<TodoDisplayData> => {
	return trpc()
		.display.create.query(data)
		.then((postedDisplay) => {
			history && TodoDisplayHistory.addAdded(postedDisplay);
			return postedDisplay;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const deleteTodoDisplay = async (data: TodoDisplayData, history = false): Promise<void> => {
	return trpc()
		.display.delete.query(data.id)
		.then(() => {
			history && TodoDisplayHistory.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

//tabs
export const getTodoTab = async (id: number): Promise<TodoTabData> => {
	return trpc()
		.tab.getSingle.query(id)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};
export const postTodoTab = async (data: TodoTabData, history = false): Promise<TodoTabData> => {
	await trpc()
		.tab.getSingle.query(data.id)
		.then((todoTab) => {
			history && TodoTabHistory.addChanged({ old: todoTab, new: data });
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});

	return trpc()
		.tab.update.query(data)
		.then((postedTab) => {
			return postedTab;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const createTodoTab = async (data: TodoTabData, history = false): Promise<TodoTabData> => {
	return trpc()
		.tab.create.query(data)
		.then((postedTab) => {
			history && TodoTabHistory.addAdded(postedTab);
			return postedTab;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const deleteTodoTab = async (data: TodoTabData, history = false): Promise<void> => {
	return trpc()
		.tab.delete.query(data.id)
		.then(() => {
			history && TodoTabHistory.addRemoved(data);
			console.log('deleteTodoTab', data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

//items
export const getTodoItems = async (todoTabId: number): Promise<TodoItemData[]> => {
	return trpc()
		.item.getByTab.query(todoTabId)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const getTodoItem = async (id: number): Promise<TodoItemData> => {
	return trpc()
		.item.getSingle.query(id)
		.then((data) => data)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const createTodoItem = async (data: TodoItemData, history = false): Promise<TodoItemData> => {
	return trpc()
		.item.create.query(data)
		.then((postedItem) => {
			history && TodoItemHistory.addAdded(postedItem);
			return postedItem;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoItem = async (data: TodoItemData, history = false): Promise<TodoItemData> => {
	await trpc()
		.item.getSingle.query(data.id)
		.then((todoItem) => {
			history && TodoItemHistory.addChanged({ old: todoItem, new: data });
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
	return trpc()
		.item.update.query(data)
		.then((postedItem) => {
			history && TodoItemHistory.addAdded(postedItem);
			return postedItem;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const deleteTodoItem = async (data: TodoItemData, history = false): Promise<void> => {
	return trpc()
		.item.delete.query(data.id)
		.then(() => {
			history && TodoItemHistory.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

//for multiple items update

export const postTodoItems = async (data: TodoItemData[]): Promise<TodoItemData[]> => {
	return trpc()
		.item.updateMany.query(data)
		.then((postedItems) => postedItems)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoTabs = async (data: TodoTabData[]): Promise<TodoTabData[]> => {
	return trpc()
		.tab.updateMany.query(data)
		.then((postedTabs) => postedTabs)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoDisplays = async (data: TodoDisplayData[]): Promise<TodoDisplayData[]> => {
	return trpc()
		.display.updateMany.query(data)
		.then((postedDisplays) => postedDisplays)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};
