<script lang="ts">
	import { TodoTabFooter, TodoTabHeader } from '$components/Todo';
	import { createTodoItem, deleteTodoItem, postTodoTab } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, isUndefined, isUndefinedOrEmpty, sortBySortOrder } from '$lib/helpers';
	import { dndVirtualization } from '$lib/helpers/dnd';
	import type { TodoItemData, TodoTabData } from '$lib/models/TodoData';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	import TodoTabDnd from './TodoTabDnd.svelte';

	export let data: TodoTabData;
	//for searchQuery filtering
	if (isUndefined(data.hidden)) data.hidden = false;

	//tabs come unsorted
	data.todoItems = sortBySortOrder(data.todoItems);

	export let onDelete: (id: number) => void;
	export let searchQuery: string = '';
	export let isDragged = false;

	let visibleItemsCount = data.todoItems.length;

	//#region crud
	let adding = false;
	const addTodoItem = async () => {
		if (adding) return;
		let todo: TodoItemData = {
			id: -1,
			title: 'New Todo Item',
			status: 'Draft',
			todoTabId: data.id,
			sortOrder: 0,
			collapsed: false
			//*add to the end
		};

		adding = true;
		createTodoItem(todo, true)
			.then(async (newItem) => {
				data.todoItems = [newItem, ...data.todoItems];
				data.todoItems = adjustSortOrder(data.todoItems);

				//push others back
				// for (let i = 1; i < data.todoItems.length; i++) {
				// 	await postTodoItem(data.todoItems[i], false);
				// }
				adding = false;
			})
			.catch();
	};

	const delTodoItem = (id: number) => {
		const index = data.todoItems.findIndex((item) => item.id === id);
		deleteTodoItem(data.todoItems[index], true)
			.then(() => {
				data.todoItems.splice(index, 1);
				data.todoItems = adjustSortOrder(data.todoItems);
			})
			.catch();
	};

	const postTodo = async () => {
		postTodoTab(data, true).catch();
	};

	const delSelf = () => {
		onDelete(data.id);
	};
	//#endregion

	const getDisplayTodoItems = (items: TodoItemData[]) => {
		let itemsCopy = [...items];
		itemsCopy = adjustSortOrder(itemsCopy);

		if (isUndefinedOrEmpty(searchQuery)) {
			visibleItemsCount = itemsCopy.length;
			itemsCopy.forEach((item) => {
				item.hidden = false;
			});

			return itemsCopy;
		}

		visibleItemsCount = 0;
		itemsCopy.forEach((item) => {
			let hidden = !item.title.toLowerCase().includes(searchQuery.toLowerCase());
			item.hidden = hidden;
			visibleItemsCount += hidden ? 0 : 1;
		});

		return itemsCopy;
	};

	$: searchQuery, (data.todoItems = getDisplayTodoItems(data.todoItems));
	$: data.todoItems = sortBySortOrder(data.todoItems);

	let isVisible = false;
</script>

<div
	class:hidden={data.hidden}
	class="isolate flex h-full flex-none flex-col rounded-md border border-subtle bg-inset sm:w-full xs:w-[350px]"
	use:dndVirtualization
	on:dndVirtualization={(event) => {
		isVisible = event.detail;
	}}
>
	{#if isVisible}
		<TodoTabHeader
			onDelete={delSelf}
			onStopTyping={postTodo}
			bind:title={data.title}
			bind:isDragged={isDragged}
			itemCount={visibleItemsCount}
		/>
		<TodoTabDnd delTodoItem={delTodoItem} bind:todoItems={data.todoItems} todoTabId={data.id} />

		<TodoTabFooter onAdd={addTodoItem} />
	{/if}
</div>
