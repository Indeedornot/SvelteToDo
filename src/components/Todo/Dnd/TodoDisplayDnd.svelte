<script lang="ts">
	import { TodoDisplayHeader, TodoDisplaySearchbar, TodoTabDnd } from '$components/Todo';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoTabData } from '$lib/models/TodoData';
	import type { TodoTabDndData, TodoTabDndEvent } from '$lib/models/TodoDndData';
	import { deleteTodoTab, postTodoDisplay, postTodoTab, postTodoTabs } from '$lib/prisma/apiCalls';
	import '$lib/styles/Scrollbar.css';
	import { dndzone } from 'svelte-dnd-action';

	export let id: number;
	export let title: string;
	export let todoTabs: TodoTabData[];
	let searchQuery: string = '';

	let dndTabs: TodoTabDndData[] = todoTabs.map((item) => {
		return {
			...item,
			dndId: `tab-${item.id}`
		};
	});

	//runs on drag in and drag out
	const handleDndConsider = (e: TodoTabDndEvent) => {
		const items: TodoTabDndData[] = e.detail.items;
		dndTabs = adjustSortOrder(items);
	};

	const handleDndFinalize = async (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem === -1) {
			dndTabs = items;
			return;
		}

		// items[changedItem].todoDisplayId = id;
		adjustSortOrder(items);
		await postTodoTabs(items.slice(changedItem, items.length));

		console.log(items);
		dndTabs = items;
	};

	const addTodoTab = async () => {
		const newTodoTab: TodoTabData = {
			id: -1,
			title: 'New Tab',
			todoDisplayId: id,
			sortOrder: todoTabs.length,
			todoItems: []
		};
		const todo = await postTodoTab(newTodoTab);
		const dndTodo: TodoTabDndData = {
			...todo,
			dndId: `tab-${todo.id}`
		};
		dndTabs = [...dndTabs, dndTodo];
	};
	const delTodoTab = (todoTabId: number) => {
		deleteTodoTab(todoTabId);
		const leftItems = dndTabs.filter((todoTab) => todoTab.id !== todoTabId);
		dndTabs = adjustSortOrder(leftItems);
	};
	const postTodo = async () => {
		await postTodoDisplay({
			id,
			title
		});
	};

	const getDisplayTodoTabs = (tabs: TodoTabDndData[]) => {
		if (isUndefinedOrEmpty(searchQuery)) return tabs;
		return tabs.filter(
			(tab) =>
				tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tab.todoItems.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
		);
	};

	$: searchQuery, (dndTabs = sortBySortOrder(dndTabs)); //needed to cause rerender on searchQuery change
</script>

<div class="flex h-full w-full flex-col bg-secondary">
	<TodoDisplayHeader onStopTyping={postTodo} bind:title />
	<TodoDisplaySearchbar onAdd={addTodoTab} onSearch={() => {}} bind:searchQuery />
	<div
		class="styled-scrollbar flex w-full flex-grow overflow-x-scroll py-[8px] child:mr-[16px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
		use:dndzone={{ items: dndTabs, type: 'display' }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each getDisplayTodoTabs(dndTabs) as todo (todo.dndId)}
			<TodoTabDnd
				onDelete={delTodoTab}
				id={todo.id}
				todoDisplayId={todo.todoDisplayId}
				sortOrder={todo.sortOrder}
				bind:title={todo.title}
				bind:todoItems={todo.todoItems}
				bind:searchQuery
			/>
		{/each}
	</div>
</div>
