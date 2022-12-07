<script lang="ts">
	import { postTodoDisplay } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder } from '$lib/helpers';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import type { TodoDisplayDndEvent } from '$lib/models/TodoDndData';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	import TodoScreenTab from './TodoScreenTab.svelte';

	export let data: TodoDisplayData[];
	export let index = 0;
	export let onDelete: (id: number) => void;
	const changeIndex = (newIndex: number) => {
		index = newIndex;
	};

	const handleDndConsider = (e: TodoDisplayDndEvent) => {
		const items: TodoDisplayData[] = e.detail.items;
		const chosenId = data[index].id;

		data = adjustSortOrder(items);
		const sortedItem = data.find((item) => item.id === chosenId);
		sortedItem && changeIndex(sortedItem.sortOrder);
		console.log('consider', index);
	};

	const handleDndFinalize = async (e: TodoDisplayDndEvent) => {
		let items: TodoDisplayData[] = e.detail.items;

		const chosenId = data[index].id;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			await postTodoDisplay(items[changedItem], false);
		}

		data = items;
		const sortedItem = data.find((item) => item.id === chosenId);
		sortedItem && changeIndex(sortedItem.sortOrder);
		console.log('finalize', index);
	};

	let isDragging = false;
	let flipDuration = 300;
</script>

<div class="flex overflow-hidden rounded-t-md">
	<div
		class="screenTabs styled-scrollbar flex overflow-x-auto rounded-t"
		use:dndzone={{ items: data, dragDisabled: !isDragging, type: 'screenTab', flipDurationMs: flipDuration }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each data as dataDisplay (dataDisplay.id)}
			<div animate:flip={{ duration: flipDuration }}>
				<TodoScreenTab
					bind:data={dataDisplay}
					onDelete={onDelete}
					changeIndex={changeIndex}
					chosen={index === dataDisplay.sortOrder}
					bind:isDragged={isDragging}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.screenTabs > :global(*:not(:last-child)) {
		margin-right: 0.25rem;
	}
</style>
