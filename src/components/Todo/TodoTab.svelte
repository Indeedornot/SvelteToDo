<script lang="ts">
	import TodoItem from './TodoItem.svelte';
	import GoPlus from 'svelte-icons/go/GoPlus.svelte';
	import type { TodoItemData } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';
	import '$lib/styles/TextArea.css';
	import { TodoTabConstr } from '$lib/models/TodoData';

	export let id: number;
	export let title: string;
	export let todoItems: TodoItemData[];

	function addTodoItem() {
		console.log('add todo item');
		todoItems = [...todoItems, { id: todoItems.length, title: 'New Todo Item', status: 'Draft' }];
	}
</script>

<div
	class="flex h-full w-[350px] flex-none flex-col rounded-md border border-2 border-accent bg-primary"
>
	<div class="h-[42px] flex-shrink-0 px-[12px] pt-[8px] pb-[2px] text-[16px] font-bold">
		<div class="flex items-center text-font-primary">
			<textarea
				contenteditable="true"
				class="stylelessTextArea overflow-hidden whitespace-nowrap p-[4px]"
				maxlength={TodoTabConstr.title}
				bind:value={title}
			/>
		</div>
	</div>
	<div class="todos styled-scrollbar flex-shrink flex-grow px-[10px] pt-[2px]">
		{#each todoItems as todoItem (todoItem.id)}
			<TodoItem {...todoItem} bind:title={todoItem.title} bind:status={todoItem.status} />
		{/each}
	</div>
	<button
		class="flex h-[42px] flex-none flex-row items-center py-[12px] px-[6px] text-[12px] text-font-secondary"
		on:click={addTodoItem}
	>
		<span class="mr-[8px] h-[16px] w-[16px]">
			<GoPlus />
		</span>
		Add Item
	</button>
</div>

<style>
	.todos {
		overflow-y: auto;
	}

	.todos > :global(*) {
		margin-bottom: 8px;
	}
</style>
