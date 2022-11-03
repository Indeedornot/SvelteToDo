import type { TodoDisplayData, TodoItemData, TodoTabData } from './TodoData';

//TODO: Refactor Hell
export const todoDisplayDiff = (source: TodoDisplayData, updated: TodoDisplayData) => {
	const update: {
		title?: string;
		todoTabs: { id: number; title: string }[];
		todoItems: TodoItemData[];
	} = {
		todoTabs: [],
		todoItems: []
	};
	const add: {
		todoTabs: TodoTabData[];
		todoItems: TodoItemData[];
	} = {
		todoTabs: [],
		todoItems: []
	};
	const del: {
		todoTabs: { id: number }[];
		todoItems: { id: number }[];
	} = {
		todoTabs: [],
		todoItems: []
	};

	if (source.title !== updated.title) {
		update.title = updated.title;
	}

	const todoTabsAdd = updated.todoTabs.filter((x) => x.id === -1);
	add.todoTabs = [...add.todoTabs, ...todoTabsAdd];

	//nonAddedTabs
	const todoTabs = updated.todoTabs.filter((x) => x.id !== -1);

	const todoTabsUpdate = todoTabs.filter((x) => source.todoTabs.find((y) => y.id === x.id && y.title !== x.title));
	update.todoTabs = [...update.todoTabs, ...todoTabsUpdate];

	const todoTabsDel = source.todoTabs.filter((x) => !todoTabs.find((y) => y.id === x.id));
	del.todoTabs = [...del.todoTabs, ...todoTabsDel];
	todoTabsDel.forEach((x) => {
		//add all items moved from this tab to the update list
		const sourceTab = source.todoTabs.find((y) => y.id === x.id);
		if (!sourceTab) return;

		//we only update if they moved to another tab
		const todoItemsUpdate = x.todoItems.filter((delItem) =>
			sourceTab.todoItems.find(
				(sourceItem) => sourceItem.id === delItem.id && sourceItem.todoTabId !== delItem.todoTabId
			)
		);
		update.todoItems = [...update.todoItems, ...todoItemsUpdate];
	});

	//nonDeletedItems and nonAddedTabs
	const todoItemsCheck = todoTabs.filter((x) => todoTabs.find((y) => y.id === x.id));
	todoItemsCheck.forEach((x) => {
		const todoItemsAdd = x.todoItems.filter((y) => y.id === -1);
		add.todoItems = [...add.todoItems, ...todoItemsAdd];

		const todoItems = x.todoItems.filter((y) => y.id !== -1);
		const sourceTab = source.todoTabs.find((y) => y.id === x.id);
		if (!sourceTab) return;

		const todoItemsUpdate = todoItems.filter((y) =>
			sourceTab.todoItems.find(
				(z) => z.id === y.id && (z.title !== y.title || z.status !== y.status || z.todoTabId !== y.todoTabId)
			)
		);
		update.todoItems = [...update.todoItems, ...todoItemsUpdate];

		const todoItemsDel = sourceTab.todoItems.filter(
			(y) => !todoItems.find((z) => z.id === y.id) && !update.todoItems.find((z) => z.id === y.id)
		);
		del.todoItems = [...del.todoItems, ...todoItemsDel];
	});

	return { update, add, del };
};
