<script lang="ts">
	import { TodoDisplaySearchbar, TodoTab } from '$components/Todo';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData, TodoTabData } from '$lib/models/TodoData';
	import { deleteTodoTab, postTodoTab } from '$lib/prisma/apiCalls';
	import { TodoTabHistory } from '$lib/stores';
	import '$lib/styles/Scrollbar.css';

	import TodoDisplayDnd from './TodoDisplayDnd.svelte';

	export let data: TodoDisplayData;
	export let isDragging = false;
	let searchQuery: string;

	//#region crud
	const addTodoTab = async () => {
		const todo: TodoTabData = {
			id: -1,
			title: 'New Tab',
			todoDisplayId: data.id,
			sortOrder: data.todoTabs.length,
			todoItems: []
		};
		postTodoTab(todo).then((newTab) => {
			TodoTabHistory.addAdded(newTab);
			data.todoTabs = [newTab, ...data.todoTabs];
		});
	};
	const delTodoTab = (todoTabId: number) => {
		deleteTodoTab(todoTabId)
			.then(() => {
				const index = data.todoTabs.findIndex((item) => item.id === todoTabId);
				TodoTabHistory.addRemoved(data.todoTabs[index]);

				data.todoTabs.splice(index, 1);
				data.todoTabs = adjustSortOrder(data.todoTabs);
			})
			.catch();
	};
	//#endregion

	const getDisplayTodoTabs = (tabs: TodoTabData[]) => {
		let tabCopy = [...tabs];
		tabCopy = adjustSortOrder(tabCopy);
		tabCopy = sortBySortOrder(tabCopy);

		if (isUndefinedOrEmpty(searchQuery)) {
			tabCopy.forEach((tab) => {
				tab.hidden = false;
			});
			return tabCopy;
		}

		tabCopy.forEach((tab) => {
			tab.hidden =
				!tab.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!tab.todoItems.some((todoItem) => todoItem.title.toLowerCase().includes(searchQuery.toLowerCase()));
		});

		return tabCopy;
	};

	$: searchQuery, (data.todoTabs = getDisplayTodoTabs(data.todoTabs));
</script>

<div class="flex h-full w-full flex-col bg-accent">
	<TodoDisplaySearchbar onAdd={addTodoTab} bind:searchQuery={searchQuery} />
	<TodoDisplayDnd
		delTodoTab={delTodoTab}
		searchQuery={searchQuery}
		bind:todoTabs={data.todoTabs}
		bind:isDragging={isDragging}
	/>
</div>
