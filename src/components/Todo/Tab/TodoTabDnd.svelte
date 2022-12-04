<script lang="ts">
	import { TodoItem } from '$components/Todo';
	import { postTodoItem } from '$lib/apiCalls/TodoActions';
	import { isUndefined } from '$lib/helpers/jsUtils';
	import { adjustSortOrder } from '$lib/helpers/sortOrder';
	import type { TodoItemData } from '$lib/models/TodoData';
	import type { TodoItemDndData, TodoItemDndEvent } from '$lib/models/TodoDndData';
	import { SOURCES, TRIGGERS, dndzone } from 'svelte-dnd-action';

	export let todoItems: TodoItemData[];
	export let todoTabId: number;
	export let delTodoItem: (id: number) => void;
	export let searchQuery: string = '';
	let isDragging: boolean = false;

	const mapDndItems = () => {
		return todoItems.map((item) => {
			return {
				...item,
				dndId: `item-${item.id}`,
				hidden: isUndefined(item.hidden) ? false : item.hidden
			};
		});
	};
	let dndItems: TodoItemDndData[] = mapDndItems();

	$: searchQuery, (dndItems = mapDndItems());
	$: if (todoItems.length !== dndItems.length) {
		dndItems = mapDndItems();
	}

	const handleDndConsider = (e: TodoItemDndEvent) => {
		const items: TodoItemDndData[] = e.detail.items;
		todoItems = dndItems = adjustSortOrder(items);

		const { source, trigger } = e.detail.info;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			isDragging = false;
		}
	};

	const handleDndFinalize = async (e: TodoItemDndEvent) => {
		let items: TodoItemDndData[] = e.detail.items;

		let newItem = items.filter((item) => item.todoTabId !== todoTabId)[0];
		//item left the tab
		if (!isUndefined(newItem)) {
			newItem.todoTabId = todoTabId;
			await postTodoItem(newItem, true);
		}

		items = adjustSortOrder(items);
		todoItems = dndItems = items;

		const { source } = e.detail.info;
		if (source === SOURCES.POINTER) {
			isDragging = false;
		}
	};
</script>

<div
	class="styled-scrollbar flex flex-shrink flex-grow flex-col overflow-auto px-[10px] pt-[2px] child:mb-[8px]"
	use:dndzone={{ items: dndItems, type: 'tab', dragDisabled: !isDragging }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each dndItems as todoItem (todoItem.dndId)}
		<TodoItem bind:data={todoItem} onDelete={delTodoItem} bind:isDragged={isDragging} />
	{/each}
</div>
