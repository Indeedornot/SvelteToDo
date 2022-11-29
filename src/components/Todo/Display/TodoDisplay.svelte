<script lang="ts">
	import { TodoDisplaySearchbar } from '$components/Todo';
	import { deleteTodoTab, postTodoTab, createTodoTab, postTodoTabs } from '$lib/apiCalls/TodoActions';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData, TodoTabData } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';

	import TodoDisplayDnd from './TodoDisplayDnd.svelte';

	export let data: TodoDisplayData;
	//tabs come unsorted
	data.todoTabs = sortBySortOrder(data.todoTabs);

	export let isDragging = false;
	let searchQuery: string;

	//#region crud
	let adding = false;
	const addTodoTab = async () => {
		if (adding) return;
		const todo: TodoTabData = {
			id: -1,
			title: 'New Tab',
			todoDisplayId: data.id,
			sortOrder: 0,
			todoItems: []
			//*add to the end
		};

		adding = true;
		createTodoTab(todo, true).then(async (newTab) => {
			data.todoTabs = [newTab, ...data.todoTabs];
			data.todoTabs = adjustSortOrder(data.todoTabs);

			await postTodoTabs(data.todoTabs.slice(1, data.length), false);
			//push others back
			// for (let i = 1; i < data.todoTabs.length; i++) {
			// 	await postTodoTab(data.todoTabs[i], false);
			// }
			adding = false;
		});
	};
	const delTodoTab = (todoTabId: number) => {
		const index = data.todoTabs.findIndex((item) => item.id === todoTabId);
		deleteTodoTab(data.todoTabs[index], true)
			.then(() => {
				data.todoTabs.splice(index, 1);
				data.todoTabs = adjustSortOrder(data.todoTabs);
			})
			.catch(() => {
				console.log('error');
			});
	};
	//#endregion

	const getDisplayTodoTabs = (tabs: TodoTabData[]) => {
		let tabCopy = [...tabs];
		tabCopy = adjustSortOrder(tabCopy);

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
	$: data.todoTabs = sortBySortOrder(data.todoTabs);
</script>

<div class="isolate flex h-full w-full flex-col bg-default">
	<TodoDisplaySearchbar onAdd={addTodoTab} bind:searchQuery={searchQuery} />
	<TodoDisplayDnd
		delTodoTab={delTodoTab}
		searchQuery={searchQuery}
		bind:todoTabs={data.todoTabs}
		bind:isDragging={isDragging}
	/>
</div>
