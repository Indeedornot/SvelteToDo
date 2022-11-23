<script lang="ts">
	import { Plus } from '$components/Icons';
	import TodoDisplay from '$components/Todo/Display/TodoDisplay.svelte';
	import { adjustSortOrder } from '$lib/helpers/sortOrder';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { deleteTodoDisplay, postTodoDisplay } from '$lib/prisma/apiCalls';

	import TodoScreenTab from './TodoScreenTab.svelte';

	export let data: TodoDisplayData[];
	let index = 0;

	const delTodoDisplay = (id: number) => {
		deleteTodoDisplay(id);
		const leftItems = data.filter((todoDisplay) => todoDisplay.id !== id);
		data = adjustSortOrder(leftItems);
	};

	const addTodoDisplay = async () => {
		const newTodoDisplay: TodoDisplayData = {
			id: -1,
			title: 'New Display',
			todoTabs: [],
			sortOrder: data.length
		};
		const todo = await postTodoDisplay(newTodoDisplay);
		data = [...data, todo];
	};

	const changeIndex = (newIndex: number) => {
		index = newIndex;
	};

	$: data = adjustSortOrder(data);
</script>

<div class="m-0 flex h-full w-full flex-none flex-col bg-primary p-0 text-font-secondary">
	<div class="scrollbar styled-scrollbar flex h-[104px] w-full flex-none overflow-x-auto bg-primary">
		<div class="screenTabs mt-auto flex h-[34px] flex-none flex-row text-[14px] sm:px-[16px] md:px-[24px] lg:px-[32px]">
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
