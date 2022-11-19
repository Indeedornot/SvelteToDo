<script lang="ts">
	import { TodoItem, TodoTabFooter, TodoTabHeader } from '$components/Todo';
	import { isUndefined, isUndefinedOrEmpty } from '$lib/helpers/jsUtils';
	import { adjustSortOrder, sortBySortOrder } from '$lib/helpers/sortOrder';
	import type { TodoItemData, TodoTabData } from '$lib/models/TodoData';
	import type { TodoItemDndData, TodoItemDndEvent } from '$lib/models/TodoDndData';
	import { deleteTodoItem, postTodoItem, postTodoItems, postTodoTab } from '$lib/prisma/apiCalls';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';
	import { dndzone } from 'svelte-dnd-action';

	export let data: TodoTabData;
	export let onDelete: (id: number) => void;
	export let searchQuery: string;
	export let hidden = false;
	export let isDragged = false;
	let isDragging = false;
	let dndItems: TodoItemDndData[] = data.todoItems.map((item) => {
		return {
			...item,
			dndId: `item-${item.id}`,
			hidden: false
		};
	});

	//#region crud
	const addTodoItem = async () => {
		let todo: TodoItemData = {
			id: -1,
			title: 'New Todo Item',
			status: 'Draft',
			todoTabId: data.id,
			sortOrder: dndItems.length
			//*add to the end
		};

		todo = await postTodoItem(todo);
		let dndTodo: TodoItemDndData = {
			...todo,
			dndId: `item-${todo.id}`,
			hidden: false
		};
		dndItems = [dndTodo, ...dndItems];
	};

	const delTodoItem = (id: number) => {
		deleteTodoItem(id);
		const leftItems = dndItems.filter((item) => item.id !== id);
		dndItems = adjustSortOrder(leftItems);
	};

	const postTodo = async () => {
		await postTodoTab(data);
	};
	//#endregion

	//#region dnd
	//runs on drag in and drag out
	const handleDndConsider = (e: TodoItemDndEvent) => {
		const items: TodoItemDndData[] = e.detail.items;

		dndItems = adjustSortOrder(items);
	};

	const handleDndFinalize = async (e: TodoItemDndEvent) => {
		let items: TodoItemDndData[] = e.detail.items;

		let newItem = items.filter((item) => item.todoTabId !== data.id)[0];
		if (!isUndefined(newItem)) {
			newItem.todoTabId = data.id;
			await postTodoItem(newItem);
		}

		//first incorect sortOrder or Item (edge case)
		let changedItem = items.findIndex((item, index) => item.sortOrder !== index);
		if (changedItem !== -1) {
			items = adjustSortOrder(items);
			await postTodoItems(items.slice(changedItem, items.length));
		}

		dndItems = items;
		isDragging = false;
	};

	const getDisplayTodoItems = (items: TodoItemDndData[]) => {
		items = adjustSortOrder(items);
		items = sortBySortOrder(items);
		if (isUndefinedOrEmpty(searchQuery)) return items;

		items.forEach((item) => {
			item.hidden = item.title.toLowerCase().includes(searchQuery.toLowerCase());
		});

		return items;
	};
	//#endregion

	let displayItems: TodoItemDndData[] = getDisplayTodoItems(dndItems);
	$: displayItems = getDisplayTodoItems(dndItems);
	$: searchQuery, (dndItems = dndItems); //needed to cause rerender on searchQuery change
	$: data.todoItems = dndItems; //needed for parent to update
</script>

<div
	class:hidden
	class="flex h-full flex-none flex-col rounded-md border border-border bg-primary sm:w-full xs:w-[350px]"
>
	<TodoTabHeader
		onDelete={() => onDelete(data.id)}
		onStopTyping={postTodo}
		bind:title={data.title}
		bind:isDragged={isDragged}
		itemCount={displayItems.length}
	/>
	<div
		class="styled-scrollbar flex-shrink flex-grow overflow-auto px-[10px] pt-[2px] child:mb-[8px]"
		use:dndzone={{ items: dndItems, type: 'tab', dragDisabled: !isDragging }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each displayItems as todoItem (todoItem.dndId)}
			<TodoItem hidden={todoItem.hidden} bind:data={todoItem} onDelete={delTodoItem} bind:isDragged={isDragging} />
		{/each}
	</div>
	<TodoTabFooter onAdd={addTodoItem} />
</div>
