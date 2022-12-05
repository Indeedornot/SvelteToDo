<script lang="ts">
	import { postTodoDisplay } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder } from '$lib/helpers';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import type { TodoDisplayDndData, TodoDisplayDndEvent } from '$lib/models/TodoDndData';
	import { dndzone } from 'svelte-dnd-action';

	import TodoScreenTab from './TodoScreenTab.svelte';

	export let data: TodoDisplayData[];
	export let index = 0;
	export let onDelete: (id: number) => void;
	const changeIndex = (newIndex: number) => {
		index = newIndex;
	};

	const mapDndItems = () => {
		return data.map((item) => {
			return {
				...item,
				dndId: `screenTab-${item.id}`
			};
		});
	};
	let dndData = mapDndItems();

	const handleDndConsider = (e: TodoDisplayDndEvent) => {
		const items: TodoDisplayDndData[] = e.detail.items;
		const chosenId = dndData[index].id;

		data = dndData = adjustSortOrder(items);
		const sortedItem = dndData.find((item) => item.id === chosenId);
		sortedItem && changeIndex(sortedItem.sortOrder);
		console.log('consider', index);
	};

	const handleDndFinalize = async (e: TodoDisplayDndEvent) => {
		let items: TodoDisplayDndData[] = e.detail.items;

		const chosenId = dndData[index].id;

		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			await postTodoDisplay(items[changedItem], false);
		}

		data = dndData = items;
		const sortedItem = dndData.find((item) => item.id === chosenId);
		sortedItem && changeIndex(sortedItem.sortOrder);
		console.log('finalize', index);
	};

	$: if (data.length !== dndData.length) {
		dndData = mapDndItems();
	}

	let showTooltip = false;
</script>

<div class="flex overflow-hidden rounded-t-md">
	<div
		class="screenTabs styled-scrollbar flex overflow-x-auto rounded-t"
		use:dndzone={{ items: dndData, dragDisabled: showTooltip }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each dndData as dataDisplay (dataDisplay.dndId)}
			<TodoScreenTab
				bind:data={dataDisplay}
				onDelete={onDelete}
				changeIndex={changeIndex}
				chosen={index === dataDisplay.sortOrder}
				bind:showTooltip={showTooltip}
			/>
		{/each}
	</div>
</div>

<style>
	.screenTabs > :global(*:not(:last-child)) {
		margin-right: 0.25rem;
	}
</style>
