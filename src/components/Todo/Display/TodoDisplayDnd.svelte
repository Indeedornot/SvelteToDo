<script lang="ts">
	import { TodoTab } from '$components/Todo';
	import { isUndefined } from '$lib/helpers/jsUtils';
	import { adjustSortOrder } from '$lib/helpers/sortOrder';
	import type { TodoTabData } from '$lib/models/TodoData';
	import type { TodoTabDndData, TodoTabDndEvent } from '$lib/models/TodoDndData';
	import { postTodoTab } from '$lib/prisma/apiCalls';
	import '$lib/styles/Scrollbar.css';
	import { dndzone } from 'svelte-dnd-action';

	export let todoTabs: TodoTabData[];
	export let delTodoTab: (todoTabId: number) => void;
	export let isDragging = false;
	export let searchQuery: string;

	let dndTabs: TodoTabDndData[] = todoTabs.map((item) => {
		return {
			...item,
			dndId: `tab-${item.id}`,
			hidden: isUndefined(item.hidden) ? false : item.hidden
		};
	});

	const handleDndConsider = (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;
		todoTabs = dndTabs = adjustSortOrder(items);
	};

	const handleDndFinalize = async (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			// items[changedItem].todoDisplayId = id; - we dont support moving between displays rn

			for (let item of items.slice(changedItem, items.length)) {
				await postTodoTab(item).catch(() => {
					item.hidden = true; //if error, hide item till next refresh
				});
			}
		}

		todoTabs = dndTabs = items;
		isDragging = false;
	};

	$: searchQuery, updateDndItems();

	const updateDndItems = () => {
		dndTabs = todoTabs.map((item) => {
			return {
				...item,
				dndId: `tab-${item.id}`,
				hidden: isUndefined(item.hidden) ? false : item.hidden
			};
		});
	};
</script>

<div
	class="styled-scrollbar todotabs flex w-full flex-grow overflow-x-auto py-[8px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
	use:dndzone={{ items: dndTabs, type: 'display', dragDisabled: !isDragging, dropFromOthersDisabled: true }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each dndTabs as todo (todo.dndId)}
		<TodoTab onDelete={delTodoTab} bind:data={todo} bind:searchQuery={searchQuery} bind:isDragged={isDragging} />
	{/each}
</div>

<style>
	.todotabs > :global(*:not(:last-child)) {
		margin-right: 8px;
	}
</style>
