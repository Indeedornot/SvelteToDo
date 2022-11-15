<script lang="ts">
	import { StatusDropdown } from '$components/Todo';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import type { TodoItemData } from '$lib/models/TodoData';
	import { TodoItemConstr } from '$lib/models/TodoDataConstr';
	import { postTodoItem } from '$lib/prisma/apiCalls';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';
	import FaMinus from 'svelte-icons/fa/FaMinus.svelte';

	export let data: TodoItemData;
	export let onDelete: (id: number) => void;
	export let isDragged: boolean = false;

	const postTodo = async () => {
		await postTodoItem(data);
	};

	const onDrag = (e: Event) => {
		e.preventDefault();
		isDragged = true;
	};
</script>

<div class="h-[66px] w-full rounded-md border border-border bg-secondary">
	<div class="box-border flex h-[8px] flex-none items-end justify-center ">
		<div
			class="box-border flex h-full w-4/12 flex-none cursor-grab rounded-b bg-accent hover:bg-primary"
			on:mousedown={onDrag}
			on:mouseup={() => {
				isDragged = false;
			}}
			class:dragging={isDragged}
		/>
	</div>

	<div class="flex w-full flex-grow flex-col pb-[12px] pr-[12px]">
		<div class="box-border flex h-[22px] w-full flex-none flex-row pl-[8px]  text-[12px] text-font-secondary">
			<div class="rounded pl-[4px] hover:bg-primary">
				<StatusDropdown bind:status={data.status} onChoose={postTodo} />
			</div>
			<div class="ml-auto flex aspect-square h-full flex-none">
				<button
					class="box-border flex h-full w-full flex-none items-center justify-center rounded text-font-secondary outline-none 
				transition-colors duration-150 ease-linear hover:bg-primary focus:outline-none"
					type="button"
					on:click={() => onDelete && onDelete(data.id)}
				>
					<div class="flex w-1/2 flex-none items-center justify-center">
						<FaMinus />
					</div>
				</button>
			</div>
		</div>
		<div class="flex flex-shrink-0 flex-grow items-center pl-[8px] text-[14px] text-font-primary">
			<div
				class="single-line content-editable w-full text-ellipsis rounded py-1 px-[4px] 
			transition-colors duration-200 ease-linear hover:bg-accent focus:bg-accent"
				contenteditable="true"
				bind:innerHTML={data.title}
				use:maxLength={TodoItemConstr.title.maxLength}
				use:truncateEditable
				use:stopTyping
				on:stopTyping={postTodo}
			/>
		</div>
	</div>
</div>

<style>
	.dragging {
		cursor: grabbing;
	}
</style>
