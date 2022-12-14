<script lang="ts">
	import { Collapse, Expand } from '$components/Icons';
	import { StatusDropdown } from '$components/Todo';
	import { ItemMore } from '$components/Todo';
	import { postTodoItem } from '$lib/apiCalls/TodoActions';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { dndHandle } from '$lib/helpers/dnd/dndHandle';
	import { dndVirtualization } from '$lib/helpers/dnd/dndVirtualization';
	import { isUndefined } from '$lib/helpers/jsUtils';
	import type { TodoItemData } from '$lib/models/TodoData';
	import { TodoItemConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/ContentEditable.css';

	export let data: TodoItemData;
	if (isUndefined(data.hidden)) data.hidden = false;

	export let onDelete: (id: number) => void;
	export let isDragged: boolean = false;
	let multiLine: boolean = false;

	const postTodo = () => {
		postTodoItem(data, true)
			.then((postedItem) => (data = postedItem))
			.catch((error) => console.log(error));
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

	let isVisible = false;

	let stoppedTyping = false;
	let blurred = false;

	$: if (stoppedTyping && blurred) {
		postTodo();
		stoppedTyping = blurred = false;
	}
</script>

<div
	class:hidden={data.hidden}
	class="border-border min-h-[67px] w-full rounded-md border border-subtle bg-subtle"
	on:dndVirtualization={(event) => (isVisible = event.detail)}
	use:dndVirtualization
>
	{#if isVisible}
		<div class="box-border flex h-[8px] flex-none touch-none items-end justify-center ">
			<div
				class="dndHandle box-border flex 
				h-full w-4/12 flex-none cursor-grab rounded-b 
				bg-default"
				use:dndHandle={isDragged}
				on:dragged={(e) => (isDragged = e.detail.isDragged)}
			/>
			<!--  hover:bg-neutral-muted 
				active:cursor-grabbing active:bg-neutral-muted -->
		</div>

		<div class="flex w-full flex-grow flex-col pr-[12px] pl-[8px]">
			<div class="mb-0.5 box-border flex h-[22px] w-full flex-none flex-row justify-between text-[12px] text-subtle">
				<div class="rounded">
					<StatusDropdown
						status={data.status}
						onChoose={(newStatus) => {
							data.status = newStatus;
							postTodo();
						}}
						canShow={!isDragged}
					/>
				</div>
				<div class="flex aspect-square h-full flex-none items-center justify-center">
					<ItemMore onDelete={deleteSelf} canShow={!isDragged} />
				</div>
			</div>
			<div class="box-border pb-1.5 pt-1">
				<div
					class="shadow shadow-bottomless rounded
				text-[14px] text-default 
				focus-within:bg-default focus-within:shadow-outline-muted 
				hover:bg-default"
				>
					{#if multiLine}
						<div
							class="border-box relative right-[1px] top-[-1.5px] float-right clear-none ml-0.5
					flex aspect-square h-[24px] flex-none items-center justify-items-center justify-self-end rounded"
						>
							<div class="border-box flex h-full w-full flex-none items-center justify-center p-[4px]">
								<button
									class="box-border flex h-full w-full flex-none items-center justify-center rounded bg-neutral-muted hover:bg-neutral-emphasis "
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
						class="content-editable h-full text-ellipsis 
				break-all rounded px-[4px]
				pb-0.5
				transition-colors duration-200 ease-linear"
						contenteditable="true"
						use:maxLength={{ maxLength: TodoItemConstr.title.maxLength, value: data.title }}
						use:truncateEditable={data.collapsed || !multiLine}
						class:single-line={data.collapsed}
						use:stopTyping
						on:stopTyping={(event) => {
							data.title = event.detail.text;
							stoppedTyping = true;
						}}
						on:focus={() => (blurred = false)}
						on:blur={() => (blurred = true)}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
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
		background-color: transparent;
	}
</style>
