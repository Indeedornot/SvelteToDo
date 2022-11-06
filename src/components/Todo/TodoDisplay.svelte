<!--! The problem is with dnd using id property-->
<script lang="ts">
	import TodoTab from './TodoTab.svelte';
	import MdFilterList from 'svelte-icons/md/MdFilterList.svelte';
	import type { TodoDisplayData, TodoTabData, TodoTabDndData } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';
	import { dndzone } from 'svelte-dnd-action';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import { postTodoItem, postTodoTab, deleteTodoTab } from '$lib/prisma/apiCalls';
	import GoPlus from 'svelte-icons/go/GoPlus.svelte';

	export let id: number;
	export let title: string;
	export let todoTabs: TodoTabData[];
	/*
	//runs on drag in and drag out
	const handleDndConsider = (e: TodoTabDndData) => {
		const items: TodoTabData[] = e.detail.items;
		items.forEach((item, index) => {
			item.sortOrder = index;
		});
		todoTabs = items;
	};
	const handleDndFinalize = (e: TodoTabDndData) => {
		console.log('New finalize');
		const items: TodoTabData[] = e.detail.items;
		console.log('items', items);

		//drag out
		if (items.length < todoTabs.length) {
			items.forEach((item, index) => {
				item.sortOrder = index;
			});
			todoTabs = items;
			console.log('todoTabs drag out', todoTabs);
		}

		//drag in
		let newItem: TodoTabData = e.detail.items.filter((item) => item.todoDisplayId !== id)[0];
		const index = items.indexOf(newItem);
		items[index].todoDisplayId = id;

		items.slice(index, items.length).forEach((item, i) => {
			item.sortOrder = i;
			postTodoTab(items[i]);
		});
		todoTabs = items;
		console.log('todoTabs drag in', todoTabs);
	};
	*/
	const addTodoTab = async () => {
		const newTodoTab: TodoTabData = {
			id: -1,
			title: 'New Tab',
			todoDisplayId: id,
			sortOrder: todoTabs.length,
			todoItems: []
		};
		const response = await postTodoTab(newTodoTab);
		console.log(response);
		todoTabs = [...todoTabs, response];
	};
	const delTodoTab = (todoTabId: number) => {
		deleteTodoTab(todoTabId);
		const leftItems = todoTabs.filter((todoTab) => todoTab.id !== todoTabId);
		todoTabs = adjustSortOrder(leftItems);
	};
</script>

<div class="flex h-full w-full flex-col bg-secondary">
	<div
		class="flex h-[40px] w-full flex-shrink-0 flex-row items-center border-y-2 border-accent px-[24px] text-font-secondary"
	>
		<div class="mr-[8px] h-[24px] w-[24px]">
			<MdFilterList />
		</div>
		<input
			class="flex flex-grow appearance-none bg-transparent px-[8px] leading-tight focus:outline-none"
			id="filter"
			type="text"
			placeholder="Filter by keyword or by field"
			aria-label="Filter by"
		/>
		<div class="flex aspect-square h-full flex-none justify-center py-1 px-1">
			<button
				class="h-full w-full rounded bg-accent text-font-secondary shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
				type="button"
				on:click={addTodoTab}
			>
				<GoPlus />
			</button>
		</div>
	</div>
	<div class="body styled-scrollbar flex w-full flex-grow overflow-x-scroll py-[8px] px-[24px]">
		<!-- use:dndzone={{ items: todoTabs, type: 'display' }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize} -->
		{#each sortBySortOrder(todoTabs) as todo (todo.id)}
			<TodoTab
				onDelete={delTodoTab}
				id={todo.id}
				todoDisplayId={todo.todoDisplayId}
				sortOrder={todo.sortOrder}
				bind:title={todo.title}
				bind:todoItems={todo.todoItems}
			/>
		{/each}
	</div>
</div>

<style>
	.body > :global(*) {
		margin-right: 8px;
	}
</style>
