<script lang="ts">
	import { TodoDisplayHeader, TodoDisplaySearchbar, TodoTab } from '$components/Todo';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData, TodoTabData } from '$lib/models/TodoData';
	import type { TodoTabDndData, TodoTabDndEvent } from '$lib/models/TodoDndData';
	import { deleteTodoTab, postTodoDisplay, postTodoTab, postTodoTabs } from '$lib/prisma/apiCalls';
	import '$lib/styles/Scrollbar.css';
	import { dndzone } from 'svelte-dnd-action';

	export let data: TodoDisplayData;
	export let isDragging = false;
	let searchQuery: string;
	let dndTabs: TodoTabDndData[] = data.todoTabs.map((item) => {
		return {
			...item,
			dndId: `tab-${item.id}`,
			hidden: false
		};
	});

	//#region crud
	const addTodoTab = async () => {
		const newTodoTab: TodoTabData = {
			id: -1,
			title: 'New Tab',
			todoDisplayId: data.id,
			sortOrder: data.todoTabs.length,
			todoItems: []
		};
		const todo = await postTodoTab(newTodoTab);
		const dndTodo: TodoTabDndData = {
			...todo,
			dndId: `tab-${todo.id}`,
			hidden: false
		};
		dndTabs = [...dndTabs, dndTodo];
	};
	const delTodoTab = (todoTabId: number) => {
		deleteTodoTab(todoTabId);
		const leftItems = dndTabs.filter((todoTab) => todoTab.id !== todoTabId);
		dndTabs = adjustSortOrder(leftItems);
	};
	const postTodo = async () => {
		await postTodoDisplay(data);
		console.log(data);
	};
	//#endregion

	//#region dnd
	//runs on drag in and drag out
	const handleDndConsider = (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;
		dndTabs = items;
	};

	const handleDndFinalize = async (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			// items[changedItem].todoDisplayId = id;
			await postTodoTabs(items.slice(changedItem, items.length));
		}

		dndTabs = items;
		isDragging = false;
	};

	const getDisplayTodoTabs = (tabs: TodoTabDndData[]) => {
		tabs = adjustSortOrder(tabs);
		tabs = sortBySortOrder(tabs);

		if (isUndefinedOrEmpty(searchQuery)) return tabs;

		tabs.forEach((tab) => {
			tab.hidden =
				!tab.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!tab.todoItems.some((todoItem) => todoItem.title.toLowerCase().includes(searchQuery.toLowerCase()));
		});

		return tabs;
	};
	//#endregion

	let displayItems = getDisplayTodoTabs(dndTabs);
	$: displayItems = getDisplayTodoTabs(dndTabs);
	$: searchQuery, (dndTabs = dndTabs); //needed to cause rerender on searchQuery change
	$: data.todoTabs = dndTabs;
</script>

<div class="flex h-full w-full flex-col bg-accent">
	<TodoDisplayHeader onStopTyping={postTodo} bind:title={data.title} />
	<TodoDisplaySearchbar onAdd={addTodoTab} bind:searchQuery={searchQuery} />
	<div
		class="styled-scrollbar todotabs flex w-full flex-grow overflow-x-auto py-[8px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
		use:dndzone={{ items: dndTabs, type: 'display', dragDisabled: !isDragging }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each displayItems as todo (todo.dndId)}
			<TodoTab
				hidden={todo.hidden}
				onDelete={delTodoTab}
				bind:data={todo}
				bind:searchQuery={searchQuery}
				bind:isDragged={isDragging}
			/>
		{/each}
	</div>
</div>

<style>
	.todotabs > :global(*:not(:last-child)) {
		margin-right: 8px;
	}
</style>
