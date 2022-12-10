<script lang="ts">
	import { TodoTab } from '$components/Todo';
	import { postTodoTab } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, isUndefined } from '$lib/helpers';
	import { dndScroll } from '$lib/helpers/dnd/dndScroll';
	import type { TodoTabData } from '$lib/models/TodoData';
	import type { TodoTabDndEvent } from '$lib/models/TodoDndData';
	import '$lib/styles/Scrollbar.css';
	import { SOURCES, TRIGGERS, dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let todoTabs: TodoTabData[];
	export let delTodoTab: (todoTabId: string) => void;
	export let isDragging = false;
	export let searchQuery: string;

	const handleDndConsider = (e: TodoTabDndEvent) => {
		let items: TodoTabData[] = e.detail.items;
		todoTabs = items;

		const { source, trigger } = e.detail.info;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			isDragging = false;
		}
	};

	const handleDndFinalize = (e: TodoTabDndEvent) => {
		let items: TodoTabData[] = e.detail.items;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);

		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			postTodoTab(items[changedItem], false);
		}

		todoTabs = items;
		const { source } = e.detail.info;
		if (source === SOURCES.POINTER) {
			isDragging = false;
		}
	};

	let flipDuration = 300;
</script>

<div
	class="styled-scrollbar todotabs flex w-full flex-grow overflow-auto bg-default py-[8px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
	use:dndzone={{
		items: todoTabs,
		type: 'display',
		dragDisabled: !isDragging,
		dropFromOthersDisabled: true,
		flipDurationMs: flipDuration
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
	use:dndScroll={{ centerSize: 100, scrollSpeed: 25 }}
>
	{#each todoTabs as todo (todo.id)}
		<div animate:flip={{ duration: flipDuration }}>
			<TodoTab onDelete={delTodoTab} bind:data={todo} bind:searchQuery={searchQuery} bind:isDragged={isDragging} />
		</div>
	{/each}
</div>

<style>
	.todotabs > :global(*:not(:last-child)) {
		margin-right: 8px;
	}
</style>
