<script lang="ts">
	import TodoItem from './TodoItem.svelte';
	import FaMinus from 'svelte-icons/fa/FaMinus.svelte';
	import GoPlus from 'svelte-icons/go/GoPlus.svelte';
	import type { TodoItemData, TodoItemDndData, TodoTabData } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';
	import '$lib/styles/TextArea.css';
	import { TodoTabConstr } from '$lib/models/TodoData';
	import { dndzone } from 'svelte-dnd-action';
	import { stopTyping } from '$lib/helpers/onStopTyping';
	import { deleteTodoItem, postTodoItem, postTodoTab } from '$lib/prisma/apiCalls';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';

	export let id: number;
	export let title: string;
	export let todoItems: TodoItemData[];
	export let todoDisplayId: number;
	export let sortOrder: number;

	export let onDelete: (id: number) => void;
	/*
	// const handleDndConsider = (e: TodoItemDndData) => {
	// 	const items: TodoItemData[] = e.detail.items;
	// 	items.forEach((item) => {
	// 		if (item.todoTabId !== id) item.todoTabId = id;
	// 	});
	// 	todoItems = items;
	// };
	// const handleDndFinalize = (e: TodoItemDndData) => {
	// 	const items: TodoItemData[] = e.detail.items;
	// 	items.forEach((item) => {
	// 		if (item.todoTabId !== id) item.todoTabId = id;
	// 	});
	// 	todoItems = items;
	// };

	//runs on drag in and drag out
	const handleDndConsider = (e: TodoItemDndData) => {
		const items: TodoItemData[] = e.detail.items;
		items.forEach((item, index) => {
			item.sortOrder = index;
		});
		todoItems = items;
	};
	const handleDndFinalize = (e: TodoItemDndData) => {
		const items: TodoItemData[] = e.detail.items;

		//drag out
		if (items.length < todoItems.length) {
			items.forEach((item, index) => {
				item.sortOrder = index;
			});
			todoItems = items;
		}

		//drag in
		let newItem: TodoItemData = e.detail.items.filter((item) => item.todoTabId !== id)[0];
		const index = items.indexOf(newItem);
		items[index].todoTabId = id;

		items.slice(index, items.length).forEach((item, i) => {
			item.sortOrder = i;
			postTodoItem(items[i]);
		});
		todoItems = items;
	};
	*/

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
</script>

<div class="flex h-full w-[350px] flex-none flex-col rounded-md border-2 border-accent bg-primary">
	<div class="h-[42px] flex-row px-[12px] pt-[8px] pb-[2px] text-[16px] font-bold">
		<div class="flex h-full w-full flex-none flex-row items-center text-font-primary">
			<textarea
				contenteditable="true"
				class="stylelessTextArea flex flex-grow overflow-hidden whitespace-nowrap p-[4px]"
				maxlength={TodoTabConstr.title.maxlength}
				bind:value={title}
				use:stopTyping
				on:stopTyping={postTodo}
			/>

			<div class="flex aspect-square h-full flex-none justify-center py-1 px-1">
				<button
					class="h-full w-full rounded bg-accent px-1 py-1 text-font-secondary shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
					type="button"
					on:click={() => onDelete && onDelete(id)}
				>
					<FaMinus />
				</button>
			</div>
		</div>
	</div>
	<div class="todos styled-scrollbar flex-shrink flex-grow px-[10px] pt-[2px]">
		<!-- use:dndzone={{ items: todoItems, type: 'tab' }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize} -->
		{#each sortBySortOrder(todoItems) as todoItem (todoItem.id)}
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
	<button
		class="flex h-[42px] flex-none flex-row items-center py-[12px] px-[6px] text-[12px] text-font-secondary"
		on:click={addTodoItem}
	>
		<span class="mr-[8px] h-[16px] w-[16px]">
			<GoPlus />
		</span>
		Add Item
	</button>
</div>

<style>
	.todos {
		overflow-y: auto;
	}

	.todos > :global(*) {
		margin-bottom: 8px;
	}
</style>
