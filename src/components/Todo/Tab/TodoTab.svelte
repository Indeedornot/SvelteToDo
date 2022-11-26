<script lang="ts">
	import { TodoItem, TodoTabFooter, TodoTabHeader } from '$components/Todo';
	import { isUndefined, isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoItemData, TodoTabData } from '$lib/models/TodoData';
	import type { TodoItemDndData, TodoItemDndEvent } from '$lib/models/TodoDndData';
	import { deleteTodoItem, postTodoItem, postTodoTab } from '$lib/prisma/apiCalls';
	import { TodoItemHistory, TodoTabHistory } from '$lib/stores';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	import TodoTabDnd from './TodoTabDnd.svelte';

	export let data: TodoTabData;
	if (isUndefined(data.hidden)) data.hidden = false;

	let startData: TodoTabData = data;

	export let onDelete: (id: number) => void;
	export let searchQuery: string = '';
	export let isDragged = false;

	let visibleItemsCount = data.todoItems.length;

	//#region crud
	const addTodoItem = async () => {
		let todo: TodoItemData = {
			id: -1,
			title: 'New Todo Item',
			status: 'Draft',
			todoTabId: data.id,
			sortOrder: data.todoItems.length,
			collapsed: false
			//*add to the end
		};

		postTodoItem(todo)
			.then((newItem) => {
				TodoItemHistory.addAdded(newItem);
				data.todoItems = [newItem, ...data.todoItems];
			})
			.catch();
	};

	const delTodoItem = (id: number) => {
		deleteTodoItem(id)
			.then(() => {
				const index = data.todoItems.findIndex((item) => item.id === id);
				TodoItemHistory.addRemoved(data.todoItems[index]);

				data.todoItems.splice(index, 1);
				data.todoItems = adjustSortOrder(data.todoItems);
			})
			.catch();
	};

	const postTodo = async () => {
		postTodoTab(data)
			.then((data) => {
				TodoTabHistory.addChanged({ old: startData, new: data });
				startData = data;
			})
			.catch(); //probably will add a modal here
	};

	const delSelf = () => {
		onDelete(data.id);
	};
	//#endregion

	const getDisplayTodoItems = (items: TodoItemData[]) => {
		let itemsCopy = [...items];
		itemsCopy = adjustSortOrder(itemsCopy);
		itemsCopy = sortBySortOrder(itemsCopy);
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
</script>

<div
	class:hidden={data.hidden}
	class="flex h-full flex-none flex-col rounded-md border border-border bg-primary sm:w-full xs:w-[350px]"
>
	<TodoTabHeader
		onDelete={delSelf}
		onStopTyping={postTodo}
		bind:title={data.title}
		bind:isDragged={isDragged}
		itemCount={visibleItemsCount}
	/>
	<TodoTabDnd delTodoItem={delTodoItem} bind:todoItems={data.todoItems} todoTabId={data.id} />

	<TodoTabFooter onAdd={addTodoItem} />
</div>
