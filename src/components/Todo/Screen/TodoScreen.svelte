<script lang="ts">
	import { Plus } from '$components/Icons';
	import { Changelog } from '$components/Todo';
	import TodoDisplay from '$components/Todo/Display/TodoDisplay.svelte';
	import { deleteTodoDisplay, postTodoDisplay } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData } from '$lib/models/TodoData';

	import TodoScreenTab from './TodoScreenTab.svelte';

	export let data: TodoDisplayData[];
	let index = 0;

	const delTodoDisplay = (id: number) => {
		const index = data.findIndex((item) => item.id === id);
		deleteTodoDisplay(data[index], true)
			.then(() => {
				data.splice(index, 1);
				data = adjustSortOrder(data);
			})
			.catch();
	};

	let adding = false;
	const addTodoDisplay = async () => {
		const newTodoDisplay: TodoDisplayData = {
			id: -1,
			title: 'New Display',
			todoTabs: [],
			sortOrder: data.length
		};
		adding = true;
		postTodoDisplay(newTodoDisplay, true)
			.then((todo) => {
				data = [...data, todo];
				data = adjustSortOrder(data);
				adding = false;
			})
			.catch();
	};

	const changeIndex = (newIndex: number) => {
		index = newIndex;
	};

	$: data = sortBySortOrder(data);
</script>

<div class="isolate flex h-full w-full flex-none flex-col">
	<div class="flex h-[104px] w-full flex-none flex-col bg-inset">
		<div
			class="flex h-[70px] w-full flex-none items-center 
				sm:px-[16px] md:px-[24px] lg:px-[32px]"
		>
			<div class="ml-auto flex flex-none">
				<Changelog />
			</div>
		</div>
		<div
			class="screenTabs styled-scrollbar flex h-[34px] w-full 
			flex-none flex-row overflow-x-auto text-[14px] text-subtle 
			sm:px-[16px] md:px-[24px] lg:px-[32px]"
		>
			{#each data as dataDisplay (dataDisplay.id)}
				<TodoScreenTab
					bind:data={dataDisplay}
					onDelete={delTodoDisplay}
					changeIndex={changeIndex}
					chosen={index === dataDisplay.sortOrder}
				/>
			{/each}
			<button class="hover:text-default" on:click={addTodoDisplay}>
				<Plus />
			</button>
		</div>
	</div>
	<div class="flex min-h-0 flex-grow bg-default">
		<!-- ! HACK - component doesn't update otherwise -->
		{#each data as dataDisplay (dataDisplay.id)}
			{#if index === dataDisplay.sortOrder}
				<TodoDisplay data={dataDisplay} />
			{/if}
		{/each}
	</div>
</div>

<style>
	.screenTabs > :global(*:not(:last-child)) {
		margin-right: 0.25rem;
	}
</style>
