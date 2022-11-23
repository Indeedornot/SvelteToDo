<script lang="ts">
	import { Collapse, Expand } from '$components/Icons';
	import { StatusDropdown } from '$components/Todo';
	import { ItemMore } from '$components/Todo';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import type { TodoItemData } from '$lib/models/TodoData';
	import { TodoItemConstr } from '$lib/models/TodoDataConstr';
	import { postTodoItem } from '$lib/prisma/apiCalls';
	import '$lib/styles/ContentEditable.css';

	export let data: TodoItemData;
	export let onDelete: (id: number) => void;
	export let isDragged: boolean = false;
	export let hidden: boolean = false;
	let multiLine: boolean = false;

	const postTodo = async () => {
		await postTodoItem(data);
	};

	const onDrag = (e: Event) => {
		e.preventDefault();
		isDragged = true;
	};

	const collapse = () => {
		data.collapsed = !data.collapsed;
		postTodo();
	};

	const deleteSelf = () => {
		onDelete(data.id);
	};

	$: {
		multiLine = /\r|\n/.exec(data.title) !== null;
		if (data.collapsed && !multiLine) {
			data.collapsed = false;
			postTodo();
		}
	}
</script>

<div class:hidden class="w-full rounded-md border border-border bg-secondary">
	<div class="box-border flex h-[8px] flex-none items-end justify-center">
		<div
			class="box-border flex h-full w-4/12 flex-none cursor-grab rounded-b bg-accent hover:bg-primary"
			on:mousedown={onDrag}
			on:mouseup={() => {
				isDragged = false;
			}}
			class:dragging={isDragged}
		/>
	</div>

	<div class="flex w-full flex-grow flex-col pr-[12px] pl-[8px]">
		<div class="mb-0.5 box-border flex h-[22px] w-full flex-none flex-row text-[12px] text-font-secondary">
			<div class="rounded pl-[4px] hover:bg-primary">
				<StatusDropdown bind:status={data.status} onChoose={postTodo} />
			</div>
			<div class="ml-auto flex aspect-square h-full flex-none items-center justify-center">
				<ItemMore onDelete={deleteSelf} />
			</div>
		</div>
		<div class="rounded-t text-[14px] text-font-primary hover:bg-accent">
			{#if multiLine}
				<div
					class="border-box relative right-[4px] top-[3px]  float-right clear-none flex aspect-square h-[24px] flex-none items-center justify-items-center justify-self-end rounded"
				>
					<div class="border-box flex h-full w-full flex-none items-center justify-center p-[4px]">
						<button
							class="box-border flex h-full w-full flex-none items-center justify-center rounded bg-black  hover:bg-border"
							on:click={collapse}
						>
							{#if data.collapsed}
								<Expand size={12} />
							{:else}
								<Collapse size={12} />
							{/if}
						</button>
					</div>
				</div>
			{/if}
			<div
				class="content-editable h-full
				text-ellipsis rounded-t bg-accent bg-opacity-40 
				py-1 px-[4px] pb-[4px]
				transition-colors duration-200 ease-linear"
				contenteditable="true"
				use:maxLength={{ maxLength: TodoItemConstr.title.maxLength, value: data.title }}
				use:truncateEditable
				class:single-line={data.collapsed}
				use:stopTyping
				on:stopTyping={(event) => {
					data.title = event.detail.text;
					postTodo();
				}}
			/>
		</div>
	</div>
</div>

<style>
	.dragging {
		cursor: grabbing;
	}

	[contenteditable='true'].single-line {
		white-space: nowrap;
		overflow: hidden;
	}

	[contenteditable='true'].single-line :global(br) {
		display: none;
	}

	[contenteditable='true'].single-line :global(*) {
		display: inline;
		white-space: nowrap;
	}
</style>
