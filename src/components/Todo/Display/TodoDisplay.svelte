<script lang="ts">
	import TodoDisplayHeader from '$components/Todo/Display/TodoDisplayHeader.svelte';
	import TodoDisplaySearchbar from '$components/Todo/Display/TodoDisplaySearchbar.svelte';
	import TodoTabDnd from '$components/Todo/Dnd/TodoTabDnd.svelte';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoTabData } from '$lib/models/TodoData';
	import { deleteTodoTab, postTodoDisplay, postTodoTab } from '$lib/prisma/apiCalls';
	import '$lib/styles/Scrollbar.css';

	export let id: number;
	export let title: string;
	export let todoTabs: TodoTabData[];
	let searchQuery: string = '';

	const addTodoTab = async () => {
		const newTodoTab: TodoTabData = {
			id: -1,
			title: 'New Tab',
			todoDisplayId: id,
			sortOrder: todoTabs.length,
			todoItems: []
		};
		const todo = await postTodoTab(newTodoTab);
		todoTabs = [...todoTabs, todo];
	};
	const delTodoTab = (todoTabId: number) => {
		deleteTodoTab(todoTabId);
		const leftItems = todoTabs.filter((todoTab) => todoTab.id !== todoTabId);
		todoTabs = adjustSortOrder(leftItems);
	};
	const postTodo = async () => {
		await postTodoDisplay({
			id,
			title
		});
	};

	const getDisplayTodoTabs = (items: TodoTabData[]) => {
		if (isUndefinedOrEmpty(searchQuery)) return items;
		return items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
	};

	$: searchQuery, (todoTabs = sortBySortOrder(todoTabs)); //needed to cause rerender on searchQuery change
</script>

<div class="flex h-full w-full flex-col bg-secondary">
	<TodoDisplayHeader onStopTyping={postTodo} bind:title />
	<TodoDisplaySearchbar onAdd={addTodoTab} onSearch={() => {}} bind:searchQuery />
	<div
		class="styled-scrollbar flex w-full flex-grow overflow-x-scroll py-[8px] child:mr-[16px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
	>
		{#each getDisplayTodoTabs(todoTabs) as todo (todo.id)}
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
