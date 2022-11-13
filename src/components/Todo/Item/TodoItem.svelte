<script lang="ts">
	import { StatusDropdown } from '$components/Todo';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { TodoItemConstr } from '$lib/models/TodoDataConstr';
	import { postTodoItem } from '$lib/prisma/apiCalls';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';
	import FaMinus from 'svelte-icons/fa/FaMinus.svelte';

	export let id: number;
	export let title: string;
	export let status: string;
	export let todoTabId: number;
	export let sortOrder: number;
	export let onDelete: (id: number) => void;

	const postTodo = async () => {
		await postTodoItem({
			id: id,
			title: title,
			status: status,
			todoTabId: todoTabId,
			sortOrder: sortOrder
		});
	};
</script>

<div class="h-[66px] w-full rounded-lg bg-secondary pt-[8px] pb-[12px] pr-[12px]">
	<div class="flex h-[24px] pl-[12px] text-[12px] text-font-secondary">
		<div class="flex flex-grow items-center">
			{status}
			<StatusDropdown bind:status onChoose={postTodo} />
		</div>
		<div class="flex aspect-square h-full flex-none">
			<button
				class="h-full w-full rounded p-1 text-font-secondary shadow outline-none transition-colors duration-150 ease-linear hover:bg-primary focus:outline-none"
				type="button"
				on:click={() => onDelete && onDelete(id)}
			>
				<FaMinus />
			</button>
		</div>
	</div>
	<div class="h-full items-center pl-[8px] text-[14px] text-font-primary">
		<div
			class="single-line content-editable w-full text-ellipsis rounded py-1 px-[4px] 
			transition-colors duration-200 ease-linear hover:bg-accent focus:bg-accent"
			contenteditable="true"
			bind:innerHTML={title}
			use:stopTyping
			on:stopTyping={postTodo}
			use:maxLength={TodoItemConstr.title.maxlength}
			use:truncateEditable
		/>
	</div>
</div>
