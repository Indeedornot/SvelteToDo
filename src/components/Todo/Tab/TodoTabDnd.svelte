<script lang="ts">
	import { TodoItem } from '$components/Todo';
	import { postTodoItem } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, isUndefined } from '$lib/helpers';
	import type { TodoItemData } from '$lib/models/TodoData';
	import type { TodoItemDndEvent } from '$lib/models/TodoDndData';
	import { SOURCES, TRIGGERS, dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let todoItems: TodoItemData[];
	export let todoTabId: number;
	export let delTodoItem: (id: number) => void;
	let isDragging: boolean = false;
	let flipDuration: number = 150;

	const handleDndConsider = (e: TodoItemDndEvent) => {
		const items: TodoItemData[] = e.detail.items;
		todoItems = adjustSortOrder(items);

		const { source, trigger } = e.detail.info;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			isDragging = false;
		}
	};

	const handleDndFinalize = async (e: TodoItemDndEvent) => {
		let items: TodoItemData[] = e.detail.items;

		let newItem = items.findIndex((item) => item.todoTabId !== todoTabId);
		//item left the tab
		if (newItem !== -1) {
			items[newItem].todoTabId = todoTabId;
			items = adjustSortOrder(items);
			await postTodoItem(items[newItem], true);
		} else {
			let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
			//item changed position
			if (changedItem === -1) return;

			items = adjustSortOrder(items);
			await postTodoItem(items[changedItem], true);
		}

		todoItems = adjustSortOrder(items);

		const { source } = e.detail.info;
		if (source === SOURCES.POINTER) {
			isDragging = false;
		}
	};
</script>

<div
	class="styled-scrollbar flex flex-shrink flex-grow flex-col overflow-auto px-[10px] pt-[2px] child:mb-[8px]"
	use:dndzone={{ items: todoItems, type: 'tab', dragDisabled: !isDragging, flipDurationMs: flipDuration }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each todoItems as todoItem (todoItem.id)}
		<div animate:flip={{ duration: flipDuration }}>
			<TodoItem bind:data={todoItem} onDelete={delTodoItem} bind:isDragged={isDragging} />
		</div>
	{/each}
</div>
