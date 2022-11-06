<script lang="ts">
	import StatusDropdown from './StatusDropdown.svelte';
	import '$lib/styles/TextArea.css';
	import { TodoItemConstr, type TodoItemData } from '$lib/models/TodoData';
	import { stopTyping } from '$lib/helpers/onStopTyping';
	import { postTodoItem } from '$lib/prisma/apiCalls';
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

<div class="h-[66px] w-full rounded-lg bg-secondary pt-[8px] pb-[12px]">
	<div class="flex h-[24px] px-[12px] text-[12px] text-font-secondary">
		<div class="flex flex-grow items-center">
			{status}
			<StatusDropdown bind:status onChoose={postTodo} />
		</div>
		<div class="flex aspect-square h-full flex-none py-1 px-1">
			<button
				class="h-full w-full rounded text-font-secondary shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
				type="button"
				on:click={() => onDelete && onDelete(id)}
			>
				<FaMinus />
			</button>
		</div>
	</div>
	<div class="flex items-center px-[12px] text-[14px] text-font-primary">
		<textarea
			class="stylelessTextArea overflow-hidden whitespace-nowrap"
			maxlength={TodoItemConstr.title.maxlength}
			bind:value={title}
			use:stopTyping
			on:stopTyping={postTodo}
		/>
	</div>
</div>
