<script lang="ts">
	import { TodoTab } from '$components/Todo';
	import { postTodoTab } from '$lib/apiCalls/TodoActions';
	import { dndScroll } from '$lib/helpers/dnd/dndScroll';
	import { isUndefined } from '$lib/helpers/jsUtils';
	import { adjustSortOrder } from '$lib/helpers/sortOrder';
	import type { TodoTabData } from '$lib/models/TodoData';
	import type { TodoTabDndData, TodoTabDndEvent } from '$lib/models/TodoDndData';
	import '$lib/styles/Scrollbar.css';
	import { SOURCES, TRIGGERS, dndzone } from 'svelte-dnd-action';

	export let todoTabs: TodoTabData[];
	export let delTodoTab: (todoTabId: number) => void;
	export let isDragging = false;
	export let searchQuery: string;

	const mapDndItems = () => {
		return todoTabs.map((item) => {
			return {
				...item,
				dndId: `tab-${item.id}`,
				hidden: isUndefined(item.hidden) ? false : item.hidden
			};
		});
	};
	let dndTabs: TodoTabDndData[] = mapDndItems();

	const handleDndConsider = (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;
		todoTabs = dndTabs = adjustSortOrder(items);

		const { source, trigger } = e.detail.info;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			isDragging = false;
		}
	};

	const handleDndFinalize = async (e: TodoTabDndEvent) => {
		let items: TodoTabDndData[] = e.detail.items;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			await postTodoTab(items[changedItem], false);
		}

		todoTabs = dndTabs = items;
		const { source } = e.detail.info;
		if (source === SOURCES.POINTER) {
			isDragging = false;
		}
	};

	$: searchQuery, (dndTabs = mapDndItems());
	$: if (todoTabs.length !== dndTabs.length) {
		dndTabs = mapDndItems();
	}
</script>

<div
	class="styled-scrollbar todotabs flex w-full flex-grow overflow-auto bg-default py-[8px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
	use:dndzone={{ items: dndTabs, type: 'display', dragDisabled: !isDragging, dropFromOthersDisabled: true }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
	use:dndScroll={{ centerSize: 100, scrollSpeed: 25 }}
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
