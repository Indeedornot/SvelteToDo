<script lang="ts">
	import TodoTab from './TodoTab.svelte';
	import MdFilterList from 'svelte-icons/md/MdFilterList.svelte';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';

	export let todos: TodoDisplayData;
</script>

<div class="flex h-full w-full flex-col bg-secondary">
	<div class="flex h-[40px] w-full flex-shrink-0 items-center border-y-2 border-accent px-[24px] text-font-secondary">
		<div class="mr-[8px] h-[24px] w-[24px]">
			<MdFilterList />
		</div>
		<input
			class="h-full w-full appearance-none bg-transparent px-[8px] leading-tight focus:outline-none"
			id="filter"
			type="text"
			placeholder="Filter by keyword or by field"
			aria-label="Filter by"
		/>
	</div>
	<div class="body styled-scrollbar flex w-full flex-grow overflow-x-scroll py-[8px] px-[24px]">
		{#each todos.todoTabs as todo (todo.id)}
			<TodoTab {...todo} bind:title={todo.title} bind:todoItems={todo.todoItems} />
		{/each}
	</div>
</div>

<style>
	.body > :global(*) {
		margin-right: 8px;
	}
</style>
