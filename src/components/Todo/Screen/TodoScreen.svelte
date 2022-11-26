<script lang="ts">
	import { Plus } from '$components/Icons';
	import TodoDisplay from '$components/Todo/Display/TodoDisplay.svelte';
	import { adjustSortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { deleteTodoDisplay, postTodoDisplay } from '$lib/prisma/apiCalls';
	import { TodoDisplayHistory } from '$lib/stores';

	import { Changelog } from '..';
	import TodoScreenTab from './TodoScreenTab.svelte';

	export let data: TodoDisplayData[];
	let index = 0;

	const delTodoDisplay = (id: number) => {
		deleteTodoDisplay(id)
			.then(() => {
				const index = data.findIndex((item) => item.id === id);
				TodoDisplayHistory.addRemoved(data[index]);

				data.splice(index, 1);
				data = adjustSortOrder(data);
			})
			.catch();
	};

	const addTodoDisplay = async () => {
		const newTodoDisplay: TodoDisplayData = {
			id: -1,
			title: 'New Display',
			todoTabs: [],
			sortOrder: data.length
		};
		postTodoDisplay(newTodoDisplay)
			.then((todo) => {
				TodoDisplayHistory.addAdded(todo);
				data = [...data, todo];
			})
			.catch();
	};

	const changeIndex = (newIndex: number) => {
		index = newIndex;
	};

	$: data = adjustSortOrder(data);
</script>

<div class="m-0 flex h-full w-full flex-none flex-col bg-primary p-0 text-font-secondary">
	<div class="flex h-[104px] w-full flex-none flex-col bg-primary ">
		<div class="flex h-[70px] w-full flex-none items-center sm:px-[16px] md:px-[24px] lg:px-[32px]">
			<div class="relative ml-auto flex flex-none">
				<Changelog />
			</div>
		</div>
		<div
			class="screenTabs styled-scrollbar flex h-[34px] w-full flex-none flex-row overflow-x-auto text-[14px] sm:px-[16px] md:px-[24px] lg:px-[32px]"
		>
			{#each data as dataDisplay (dataDisplay.id)}
				<TodoScreenTab
					data={dataDisplay}
					onDelete={delTodoDisplay}
					changeIndex={changeIndex}
					chosen={index === dataDisplay.sortOrder}
				/>
			{/each}
			<button on:click={addTodoDisplay}>
				<Plus />
			</button>
		</div>
	</div>
	<div class="flex min-h-0 flex-grow bg-secondary">
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
