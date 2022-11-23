<script lang="ts">
	import { TodoDisplaySearchbar, TodoTab } from '$components/Todo';
	import { isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData, TodoTabData } from '$lib/models/TodoData';
	import type { TodoTabDndData, TodoTabDndEvent } from '$lib/models/TodoDndData';
	import { deleteTodoTab, postTodoTab } from '$lib/prisma/apiCalls';
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
		postTodoTab(newTodoTab).then((data) => {
			let dndTab: TodoTabDndData = {
				...data,
				dndId: `tab-${data.id}`,
				hidden: false
			};
			dndTabs = [dndTab, ...dndTabs];
		});
	};
	const delTodoTab = (todoTabId: number) => {
		deleteTodoTab(todoTabId)
			.then(() => {
				const leftItems = dndTabs.filter((todoTab) => todoTab.id !== todoTabId);
				dndTabs = adjustSortOrder(leftItems);
			})
			.catch();
	};
	//#endregion

	//#region dnd
	//runs on drag in and drag out
	const handleDndConsider = (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;
		dndTabs = items;
	};

	const handleDndFinalize = (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			// items[changedItem].todoDisplayId = id; - we dont support moving between displays rn
			items.slice(changedItem, items.length).forEach(async (item) => {
				await postTodoTab(item).catch(() => {
					item.hidden = true; //if error, hide item till next refresh
				});
			});
		}

		dndTabs = items;
		isDragging = false;
	};

	const getDisplayTodoTabs = (tabs: TodoTabDndData[]) => {
		let tabCopy = [...tabs];
		tabCopy = adjustSortOrder(tabCopy);
		tabCopy = sortBySortOrder(tabCopy);

		if (isUndefinedOrEmpty(searchQuery)) return tabCopy;

		tabCopy.forEach((tab) => {
			tab.hidden =
				!tab.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!tab.todoItems.some((todoItem) => todoItem.title.toLowerCase().includes(searchQuery.toLowerCase()));
		});

		return tabCopy;
	};
	//#endregion

	$: searchQuery, (dndTabs = getDisplayTodoTabs(dndTabs));
	$: data.todoTabs = dndTabs;
</script>

<div class="flex h-full w-full flex-col bg-accent">
	<TodoDisplaySearchbar onAdd={addTodoTab} bind:searchQuery={searchQuery} />
	<div
		class="styled-scrollbar todotabs flex w-full flex-grow overflow-x-auto py-[8px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
		use:dndzone={{ items: dndTabs, type: 'display', dragDisabled: !isDragging, dropFromOthersDisabled: true }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each dndTabs as todo (todo.dndId)}
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
