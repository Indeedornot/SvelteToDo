import type {
	TodoDisplayCreateData,
	TodoDisplayData,
	TodoItemCreateData,
	TodoItemData,
	TodoTabCreateData,
	TodoTabData
} from '$lib/models/TodoData';
import cuid from 'cuid';

import type { TodoDisplay, TodoTab } from '../models';
import { db } from './db';

//#region get
export const getTodoDisplay = async (id: string, withChildren: boolean) => {
	const todoDisplay = await db.displays.get(id);
	if (!todoDisplay) throw new Error('TodoDisplay not found');

	withChildren && (await loadTabs(todoDisplay));
	return todoDisplay;
};

export const getTodoDisplays = async (withTabs: boolean) => {
	const todoDisplays = await db.displays.toArray();
	if (withTabs) {
		for (const todoDisplay of todoDisplays) {
			await loadTabs(todoDisplay);
		}
	}

	return todoDisplays;
};

export const getTodoTab = async (id: string, withChildren: boolean) => {
	const todoTab = await db.tabs.get(id);

	if (!todoTab) throw new Error('TodoTab not found');
	withChildren && (await loadItems(todoTab));

	return todoTab;
};

export const getTodoTabsByDisplay = async (displayId: string, withChildren: boolean) => {
	const todoTabs = await db.tabs.where('todoDisplayId').equals(displayId).toArray();
	if (withChildren) {
		for (const todoTab of todoTabs) {
			await loadItems(todoTab);
		}
	}
	return todoTabs;
};

export const getTodoItem = async (id: string) => {
	const todoItem = await db.items.get(id);
	if (!todoItem) throw new Error('TodoItem not found');
	return todoItem;
};

export const getTodoItemsByTab = async (tabId: string) => {
	const todoItems = await db.items.where('todoTabId').equals(tabId).toArray();
	return todoItems;
};
//#endregion

//#region update

//#region SortOrder

const updateTodoDisplaySortOrder = async (id: string, newSortOrder: number) => {
	const todoDisplay = await db.displays.get(id);
	if (!todoDisplay) throw new Error('TodoDisplay not found');

	if (todoDisplay.sortOrder === newSortOrder) return;
	if (todoDisplay.sortOrder > newSortOrder) {
		await db.displays
			.where('sortOrder')
			.between(newSortOrder, todoDisplay.sortOrder - 1)
			.modify((tab) => {
				tab.sortOrder += 1;
			});
		return;
	}
	//todoDisplay.sortOrder < oldSort
	await db.displays
		.where('sortOrder')
		.between(todoDisplay.sortOrder + 1, newSortOrder)
		.modify((tab) => {
			tab.sortOrder -= 1;
		});
};

const updateTodoTabSortOrder = async (id: string, newSortOrder: number) => {
	const todoTab = await db.tabs.get(id);
	if (!todoTab) throw new Error('TodoTab not found');

	if (todoTab.sortOrder === newSortOrder) return;
	if (todoTab.sortOrder > newSortOrder) {
		await db.tabs
			.where('sortOrder')
			.between(newSortOrder, todoTab.sortOrder - 1)
			.modify((tab) => {
				tab.sortOrder += 1;
			});
		return;
	}
	//todoTab.sortOrder < oldSort
	await db.tabs
		.where('sortOrder')
		.between(todoTab.sortOrder + 1, newSortOrder)
		.modify((tab) => {
			tab.sortOrder -= 1;
		});
};

const updateTodoItemSortOrder = async (id: string, newSortOrder: number) => {
	const todoItem = await db.items.get(id);
	if (!todoItem) throw new Error('TodoItem not found');

	if (todoItem.sortOrder === newSortOrder) return;
	if (todoItem.sortOrder > newSortOrder) {
		await db.items
			.where('sortOrder')
			.between(newSortOrder, todoItem.sortOrder - 1)
			.modify((item) => {
				item.sortOrder += 1;
			});
		return;
	}

	//todoItem.sortOrder < oldSort
	await db.items
		.where('sortOrder')
		.between(todoItem.sortOrder + 1, newSortOrder)
		.modify((item) => {
			item.sortOrder -= 1;
		});
};
//#endregion

export const updateTodoDisplay = async (todoDisplay: TodoDisplayData) => {
	await updateTodoDisplaySortOrder(todoDisplay.id, todoDisplay.sortOrder);
	todoDisplay.updatedAt = new Date();
	await db.displays.put(todoDisplay);
};

export const updateTodoTab = async (todoTab: TodoTabData) => {
	await updateTodoTabSortOrder(todoTab.id, todoTab.sortOrder);
	todoTab.updatedAt = new Date();
	await db.tabs.put(todoTab);
};

export const updateTodoItem = async (todoItem: TodoItemData) => {
	await updateTodoItemSortOrder(todoItem.id, todoItem.sortOrder);
	todoItem.updatedAt = new Date();
	await db.items.put(todoItem);
};
//#endregion

//#region create
export const addTodoDisplay = async (todoDisplay: TodoDisplayCreateData) => {
	const displayData = mapDisplay(todoDisplay);
	await db.displays.put(displayData);

	return displayData;
};

export const addTodoTab = async (todoTab: TodoTabCreateData) => {
	const data = mapTab(todoTab);
	await db.tabs.put(data);

	return data;
};

export const addTodoItem = async (todoItem: TodoItemCreateData) => {
	const data = mapItem(todoItem);
	await db.items.add(data);
	return data;
};
//#endregion

//#region delete
export const deleteTodoItem = async (id: string) => {
	await db.items.where('id').equals(id).delete();
};

export const deleteTodoTab = async (id: string) => {
	await db.items.where('todoTabId').equals(id).delete();
	await db.tabs.where('id').equals(id).delete();
};

export const deleteTodoDisplay = async (id: string) => {
	const tabs = await db.tabs.where('todoDisplayId').equals(id).toArray();
	for (const tab of tabs) {
		await deleteTodoTab(tab.id);
	}

	await db.displays.where('id').equals(id).delete();
};
//#endregion

//#region internal load
const loadTabs = async (todoDisplay: TodoDisplay) => {
	const tabs = await db.tabs.where('todoDisplayId').equals(todoDisplay.id).toArray();
	for (const tab of tabs) {
		await loadItems(tab);
	}
	todoDisplay.todoTabs = tabs;
};

const loadItems = async (todoTab: TodoTab) => {
	const items = await db.items.where('todoTabId').equals(todoTab.id).toArray();
	todoTab.todoItems = items;
};
//#endregion

//#region mapping
const mapDisplay = (todoDisplay: TodoDisplayCreateData) => {
	return {
		...todoDisplay,
		id: cuid(),
		todoTabs: todoDisplay?.todoTabs?.map(mapTab) || [],
		createdAt: new Date(),
		updatedAt: new Date()
	};
};

const mapTab = (todoTab: TodoTabCreateData) => {
	return {
		...todoTab,
		id: cuid(),
		todoItems: todoTab?.todoItems?.map(mapItem) || [],
		createdAt: new Date(),
		updatedAt: new Date()
	};
};

const mapItem = (todoItem: TodoItemCreateData) => {
	return {
		...todoItem,
		id: cuid(),
		createdAt: new Date(),
		updatedAt: new Date()
	};
};
//#endregion
