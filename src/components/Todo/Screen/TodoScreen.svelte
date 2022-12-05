<script lang="ts">
	import { Plus } from '$components/Icons';
	import { Changelog } from '$components/Todo';
	import TodoDisplay from '$components/Todo/Display/TodoDisplay.svelte';
	import { createTodoDisplay, deleteTodoDisplay } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { sortOrder } from '$lib/trpc/models/TodoData';

	import TodoScreenTabDnd from './TodoScreenTabDnd.svelte';

	export let data: TodoDisplayData[];
	let index = 0;

	const delTodoDisplay = (id: number) => {
		if (data.length === 1) return;
		const delIndex = data.findIndex((item) => item.id === id);
		deleteTodoDisplay(data[delIndex], true)
			.then(() => {
				data.splice(delIndex, 1);
				data = adjustSortOrder(data);
				if (index < data.length) return;
				else index--;
			})
			.catch();
	};

	let adding = false;
	const addTodoDisplay = async () => {
		if (adding) return;
		const newTodoDisplay: TodoDisplayData = {
			id: -1,
			title: 'New Display',
			todoTabs: [],
			sortOrder: data.length
		};
		adding = true;
		createTodoDisplay(newTodoDisplay, true)
			.then((todo) => {
				data = [...data, todo];
				data = adjustSortOrder(data);
				adding = false;
			})
			.catch();
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
			class="flex h-[34px] w-full flex-none
			flex-row items-center text-[14px] text-subtle 
			sm:px-[16px] md:px-[24px] lg:px-[32px]"
		>
			<TodoScreenTabDnd onDelete={delTodoDisplay} bind:data={data} bind:index={index} />
			<button class="hover:text-default" on:click={addTodoDisplay}>
				<Plus />
			</button>
		</div>
	</div>
	<div class="flex min-h-0 flex-grow bg-default">
		<TodoDisplay data={data[index]} />
	</div>
</div>
