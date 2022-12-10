import Dexie from 'dexie';

import { TodoDisplay, TodoItem, TodoTab } from '../models/';

export class AppDatabase extends Dexie {
	displays!: Dexie.Table<TodoDisplay, string>;
	tabs!: Dexie.Table<TodoTab, string>;
	items!: Dexie.Table<TodoItem, string>;

	constructor() {
		super('DisplaysDatabase');
		const db = this;

		//
		// Define tables and indexes
		//
		db.version(1).stores({
			displays: '&id, title, sortOrder',
			tabs: '&id, title, sortOrder, todoDisplayId',
			items: '&id, title, sortOrder, status, todoTabId, collapsed'
		});

		// Let's physically map Contact class to contacts table.
		// This will make it possible to call loadEmailsAndPhones()
		// directly on retrieved database objects.
		db.displays.mapToClass(TodoDisplay);
		db.tabs.mapToClass(TodoTab);
		db.items.mapToClass(TodoItem);
	}
}
export const db = new AppDatabase();
