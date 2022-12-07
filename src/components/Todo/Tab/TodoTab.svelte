<script lang="ts">
	import { TodoTabFooter, TodoTabHeader } from '$components/Todo';
	import { createTodoItem, deleteTodoItem, postTodoTab } from '$lib/apiCalls/TodoActions';
	import { adjustSortOrder, isUndefined, isUndefinedOrEmpty, sortBySortOrder } from '$lib/helpers';
	import { type TabFilterData, sortType } from '$lib/models/FilterData/TabFilterData';
	import { type TodoItemCreateData, type TodoItemData, type TodoTabData, statusType } from '$lib/models/TodoData';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	import TodoTabDnd from './TodoTabDnd.svelte';

	export let data: TodoTabData;
	//for searchQuery filtering
	if (isUndefined(data.hidden)) data.hidden = false;

	//tabs come unsorted
	data.todoItems = sortBySortOrder(data.todoItems);

	let filterData: TabFilterData;
	export let onDelete: (id: number) => void;
	export let searchQuery: string = '';
	export let isDragged = false;
	let visibleItemsCount = data.todoItems.length;

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
			.then(async (newItem) => {
				data.todoItems = [newItem, ...data.todoItems];
				data.todoItems = adjustSortOrder(data.todoItems);
				adding = false;
			})
			.catch();
	};

	const delTodoItem = (id: number) => {
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

	const getVisibility = (todoItems: TodoItemData[]) => {
		const query = searchQuery?.toLowerCase();
		const isValidQuery = !isUndefinedOrEmpty(query);
		const containsQuery = (item: TodoItemData) => {
			return !isValidQuery || item.title.toLowerCase().includes(query);
		};

		const isFilteredOut = (item: TodoItemData) => {
			return filterData && !filterData?.itemData.statuses[item.status];
		};

		let itemsCopy = [...todoItems];
		itemsCopy = adjustSortOrder(itemsCopy);

		if (data.hidden) return itemsCopy;

		if (!isValidQuery && !filterData) {
			visibleItemsCount = itemsCopy.length;
			return itemsCopy.map((item) => {
				item.hidden = false;
				return item;
			});
		}

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

	const filter = (sort: sortType, todoItems: TodoItemData[]) => {
		const todoItemsCopy = [...todoItems];

		switch (sort) {
			case sortType.status:
				todoItemsCopy.sort((a, b) => a.status.localeCompare(b.status));
				break;
			case sortType.created:
				todoItemsCopy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
				break;
			case sortType.updated:
				todoItemsCopy.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
				break;
			case sortType.none:
			default:
				break;
		}

		return adjustSortOrder(todoItemsCopy);
	};

	$: searchQuery, filterData, (data.todoItems = sortBySortOrder(getVisibility(data.todoItems)));
</script>

<div
	class:hidden={data.hidden}
	class="isolate flex h-full flex-none flex-col rounded-md border border-subtle bg-inset sm:w-full xs:w-[350px]"
>
	<TodoTabHeader
		onDelete={delSelf}
		onStopTyping={postTodo}
		bind:title={data.title}
		bind:isDragged={isDragged}
		itemCount={visibleItemsCount}
		bind:filterData={filterData}
		onSort={(value) => {
			console.log('sort', value);
			data.todoItems = filter(value, data.todoItems);
			console.table(data.todoItems);
		}}
	/>
	<TodoTabDnd delTodoItem={delTodoItem} bind:todoItems={data.todoItems} todoTabId={data.id} />

	<TodoTabFooter onAdd={addTodoItem} />
</div>
