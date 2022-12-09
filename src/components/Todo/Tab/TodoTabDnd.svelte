<script lang="ts">
	import { TodoItem } from '$components/Todo';
	import { postTodoItem } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder } from '$lib/helpers/sortOrder';
	import type { TodoItemData } from '$lib/models/TodoData';
	import type { TodoItemDndEvent } from '$lib/models/TodoDndData';
	import { SOURCES, TRIGGERS, dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let todoItems: TodoItemData[];
	export let todoTabId: number;
	export let delTodoItem: (id: number) => void;
	export let updateItems: () => void;
	let isDragging: boolean = false;
	let flipDuration = 150;
	let causeUpdate = false;

	const handleDndConsider = (e: TodoItemDndEvent) => {
		const items: TodoItemData[] = e.detail.items;

		if (items.length > todoItems.length) {
			causeUpdate = true;
		}

		todoItems = adjustSortOrder(items);

		const { source, trigger } = e.detail.info;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			isDragging = false;
		}
	};

	const handleDndFinalize = (e: TodoItemDndEvent) => {
		let items: TodoItemData[] = e.detail.items;
		let newItem = items.findIndex((item, index) => item.todoTabId !== todoTabId || item.sortOrder !== index);
		items = adjustSortOrder(items);

		//item came into the tab
		if (newItem !== -1) {
			items[newItem].todoTabId = todoTabId;
			postTodoItem(items[newItem], true);
		}

		todoItems = items;

		if (causeUpdate) {
			updateItems();
			causeUpdate = false;
		}

		const { source } = e.detail.info;
		if (source === SOURCES.POINTER) {
			isDragging = false;
		}
	};
</script>

<div
	class="styled-scrollbar flex flex-shrink flex-grow flex-col overflow-auto px-[10px] pt-[2px]"
	use:dndzone={{ items: todoItems, type: 'tab', dragDisabled: !isDragging, flipDurationMs: flipDuration }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each todoItems as todoItem (todoItem.id)}
		<div animate:flip={{ duration: flipDuration }} style={todoItem.hidden ? '' : 'margin-bottom: 8px'}>
			<TodoItem bind:data={todoItem} onDelete={delTodoItem} bind:isDragged={isDragging} />
		</div>
	{/each}
</div>
