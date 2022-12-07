import type {
	TodoDisplayCreateData,
	TodoDisplayData,
	TodoItemCreateData,
	TodoItemData,
	TodoTabCreateData,
	TodoTabData
} from '$lib/models/TodoData';
import {
	todoDisplay,
	todoDisplayCreate,
	todoItem,
	todoItemCreate,
	todoTab,
	todoTabCreate
} from '$lib/models/TodoSchema';
import { isSynced } from '$lib/stores/Sync';
import { TodoHistory } from '$lib/stores/Todo/TodoHistory';
import { trpc } from '$lib/trpc/client';

export const getTodoDisplays = async (): Promise<TodoDisplayData[]> => {
	return trpc()
		.display.getAll.query()
		.then((todoDisplays) => todoDisplays)
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

export const postTodoDisplay = async (data: TodoDisplayData, history = false): Promise<TodoDisplayData> => {
	if (history) {
		await trpc()
			.display.getSingle.query(data.id)
			.then((todoDisplay) => {
				TodoHistory.Display.addChanged({ old: todoDisplay, new: data });
			})
			.catch((error) => {
				isSynced.set({ isSync: false, error: error });
				return Promise.reject(error);
			});
	}

	const body = todoDisplay.parse(data);
	return trpc()
		.display.update.query(body)
		.then((postedDisplay) => postedDisplay)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const createTodoDisplay = async (data: TodoDisplayCreateData, history = false): Promise<TodoDisplayData> => {
	const body = todoDisplayCreate.parse(data);
	return trpc()
		.display.create.query(body)
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
	return trpc()
		.display.delete.query(data.id)
		.then(() => {
			history && TodoHistory.Display.addRemoved(data);
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

export const getTodoTabs = async (todoDisplayId: number): Promise<TodoTabData[]> => {
	return trpc()
		.tab.getByDisplay.query(todoDisplayId)
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoTab = async (data: TodoTabData, history = false): Promise<TodoTabData> => {
	if (history) {
		await trpc()
			.tab.getSingle.query(data.id)
			.then((todoTab) => {
				TodoHistory.Tab.addChanged({ old: todoTab, new: data });
			})
			.catch((error) => {
				isSynced.set({ isSync: false, error: error });
				return Promise.reject(error);
			});
	}

	const body = todoTab.parse(data);
	return trpc()
		.tab.update.query(body)
		.then((postedTab) => {
			return postedTab;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const createTodoTab = async (data: TodoTabCreateData, history = false): Promise<TodoTabData> => {
	const body = todoTabCreate.parse(data);
	return trpc()
		.tab.create.query(body)
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
	return trpc()
		.tab.delete.query(data.id)
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

export const createTodoItem = async (data: TodoItemCreateData, history = false): Promise<TodoItemData> => {
	const body = todoItemCreate.parse(data);
	return trpc()
		.item.create.query(body)
		.then((postedItem) => {
			history && TodoHistory.Item.addAdded(postedItem);
			return postedItem;
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};

export const postTodoItem = async (data: TodoItemData, history = false): Promise<TodoItemData> => {
	if (history) {
		await trpc()
			.item.getSingle.query(data.id)
			.then((todoItem) => {
				TodoHistory.Item.addChanged({ old: todoItem, new: data });
			})
			.catch((error) => {
				isSynced.set({ isSync: false, error: error });
				return Promise.reject(error);
			});
	}

	const body = todoItem.parse(data);
	return trpc()
		.item.update.query(body)
		.then((postedItem) => {
			history && TodoHistory.Item.addAdded(postedItem);
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
			history && TodoHistory.Item.addRemoved(data);
		})
		.catch((error) => {
			isSynced.set({ isSync: false, error: error });
			return Promise.reject(error);
		});
};
