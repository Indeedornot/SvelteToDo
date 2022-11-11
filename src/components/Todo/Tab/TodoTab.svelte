<script lang="ts">
	import TodoItem from '$components/Todo/Item/TodoItem.svelte';
	import TodoTabFooter from '$components/Todo/Tab/TodoTabFooter.svelte';
	import TodoTabHeader from '$components/Todo/Tab/TodoTabHeader.svelte';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoItemData } from '$lib/models/TodoData';
	import { deleteTodoItem, postTodoItem, postTodoTab } from '$lib/prisma/apiCalls';
	import '$lib/styles/Scrollbar.css';
	import '$lib/styles/TextArea.css';

	export let id: number;
	export let title: string;
	export let todoItems: TodoItemData[];
	export let searchQuery: string;
	export let todoDisplayId: number;
	export let sortOrder: number;

	export let onDelete: (id: number) => void;

	const addTodoItem = async () => {
		let todo: TodoItemData = {
			id: -1,
			title: 'New Todo Item',
			status: 'Draft',
			todoTabId: id,
			sortOrder: todoItems.length
			//*add to the end
		};

		todo = await postTodoItem(todo);
		todoItems = [todo, ...todoItems];
	};
	const delTodoItem = (id: number) => {
		deleteTodoItem(id);
		const leftItems = todoItems.filter((item) => item.id !== id);
		todoItems = adjustSortOrder(leftItems);
	};
	const postTodo = async () => {
		await postTodoTab({
			id: id,
			title: title,
			todoDisplayId: todoDisplayId,
			sortOrder: sortOrder
		});
	};

	const getDisplayTodoItems = (items: TodoItemData[]) => {
		items = sortBySortOrder(items);
		if (isUndefinedOrEmpty(searchQuery)) return items;
		return items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
	};

	$: searchQuery, (todoItems = todoItems); //needed to cause rerender on searchQuery change
</script>

<div class="flex h-full flex-none flex-col rounded-md border border-accent bg-primary sm:w-full xs:w-[350px]">
	<TodoTabHeader onDelete={() => onDelete(id)} onStopTyping={() => postTodo()} bind:title />
	<div class="styled-scrollbar flex-shrink flex-grow overflow-auto px-[10px] pt-[2px] child:mb-[8px]">
		{#each getDisplayTodoItems(todoItems) as todoItem (todoItem.id)}
			<TodoItem
				id={todoItem.id}
				onDelete={delTodoItem}
				todoTabId={todoItem.todoTabId}
				sortOrder={todoItem.sortOrder}
				bind:title={todoItem.title}
				bind:status={todoItem.status}
			/>
		{/each}
	</div>
	<TodoTabFooter onAdd={() => addTodoItem()} />
</div>
