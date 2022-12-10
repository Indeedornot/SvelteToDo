<script lang="ts">
	import { TodoTabFooter, TodoTabHeader } from '$components/Todo';
	import { createTodoItem, deleteTodoItem, postTodoTab } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, isUndefined, isUndefinedOrEmpty, sortBySortOrder } from '$lib/helpers';
	import { type TabFilterData, getDefaultFilterData, sortType } from '$lib/models/FilterData/TabFilterData';
	import { type TodoItemCreateData, type TodoItemData, type TodoTabData, statusType } from '$lib/models/TodoData';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	import TodoTabDnd from './TodoTabDnd.svelte';

	export let data: TodoTabData;
	if (isUndefined(data.hidden)) data.hidden = false; //for searchQuery filtering

	export let onDelete: (id: string) => void;
	let filterData: TabFilterData;
	let visibleItemsCount = data.todoItems.length;
	export let searchQuery: string = '';
	export let isDragged = false;

	//#region crud
	let adding = false;
	const addTodoItem = async () => {
		if (adding) return;
		let todo: TodoItemCreateData = {
			title: 'New Todo Item',
			status: statusType.draft,
			todoTabId: data.id,
			sortOrder: 0,
			collapsed: false
			//*add to the end
		};

		adding = true;
		createTodoItem(todo, true)
			.then((newItem) => {
				resetFilter();
				data.todoItems = [newItem, ...data.todoItems];
				data.todoItems = adjustSortOrder(data.todoItems);
				adding = false;
			})
			.catch();
	};

	const delTodoItem = (id: string) => {
		const index = data.todoItems.findIndex((item) => item.id === id);
		deleteTodoItem(data.todoItems[index], true)
			.then(() => {
				data.todoItems.splice(index, 1);
				data.todoItems = adjustSortOrder(data.todoItems);
			})
			.catch();
	};

	const postTodo = async () => {
		postTodoTab(data, true).catch();
	};

	const delSelf = () => {
		onDelete(data.id);
	};
	//#endregion

	const resetFilter = () => {
		filterData = getDefaultFilterData();
	};

	const getVisibility = (todoItems: TodoItemData[]) => {
		if (data.hidden) return todoItems;
		let itemsCopy = [...todoItems];
		itemsCopy = adjustSortOrder(itemsCopy);

		const query = searchQuery?.toLowerCase();
		const isValidQuery = !isUndefinedOrEmpty(query);

		if (!isValidQuery && !filterData) {
			visibleItemsCount = itemsCopy.length;
			return itemsCopy.map((item) => {
				item.hidden = false;
				return item;
			});
		}

		const containsQuery = (item: TodoItemData) => {
			return !isValidQuery || item.title.toLowerCase().includes(query);
		};

		const isFilteredOut = (item: TodoItemData) => {
			return filterData && !filterData?.statuses[item.status];
		};

		visibleItemsCount = 0;
		itemsCopy.forEach((item) => {
			if (!containsQuery(item) || isFilteredOut(item)) item.hidden = true;
			else {
				item.hidden = false;
				visibleItemsCount++;
			}
		});

		return itemsCopy;
	};

	const sort = (sort: sortType, todoItems: TodoItemData[]) => {
		const todoItemsCopy = [...todoItems];

		switch (sort) {
			case sortType.status:
				todoItemsCopy.sort((a, b) => a.status.localeCompare(b.status));
				break;
			case sortType.created:
				todoItemsCopy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
				break;
			case sortType.updated:
				todoItemsCopy.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
				break;
			case sortType.none:
			default:
				break;
		}

		return adjustSortOrder(todoItemsCopy);
	};

	const updateItems = () => {
		data.todoItems = getVisibility(data.todoItems);
	};

	$: searchQuery, filterData, updateItems();
</script>

<div
	class:hidden={data.hidden}
	class="isolate flex h-full flex-none flex-col rounded-md border border-subtle bg-inset sm:w-full xs:w-[350px]"
>
	<TodoTabHeader
		onDelete={delSelf}
		onStopTyping={postTodo}
		onSort={(value) => (data.todoItems = sort(value, data.todoItems))}
		bind:title={data.title}
		itemCount={visibleItemsCount}
		bind:filterData={filterData}
		id={data.id}
		bind:isDragged={isDragged}
	/>
	<TodoTabDnd delTodoItem={delTodoItem} bind:todoItems={data.todoItems} todoTabId={data.id} updateItems={updateItems} />

	<TodoTabFooter onAdd={addTodoItem} />
</div>
