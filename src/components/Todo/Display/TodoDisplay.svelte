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
	let searchQuery: string = '';
	export let isDragging = false;

	let dndTabs: TodoTabDndData[] = data.todoTabs.map((item) => {
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
		if (changedItem !== -1) {
			// items[changedItem].todoDisplayId = id;
			items = adjustSortOrder(items);
			await postTodoTabs(items.slice(changedItem, items.length));
		}

		dndTabs = items;
		isDragging = false;
	};

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
		await postTodoDisplay(data);
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

<div class="flex h-full w-full flex-col bg-accent">
	<TodoDisplayHeader onStopTyping={postTodo} title={data.title} />
	<TodoDisplaySearchbar onAdd={addTodoTab} onSearch={() => {}} bind:searchQuery />
	<div
		class="styled-scrollbar flex w-full flex-grow overflow-x-scroll py-[8px] child:mr-[8px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
		use:dndzone={{ items: dndTabs, type: 'display', dragDisabled: !isDragging }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each getDisplayTodoTabs(dndTabs) as todo (todo.dndId)}
			<TodoTab onDelete={delTodoTab} bind:data={todo} bind:searchQuery bind:isDragged={isDragging} />
		{/each}
	</div>
</div>
