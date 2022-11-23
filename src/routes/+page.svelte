<script lang="ts">
	import TodoScreen from '$components/Todo/Screen/TodoScreen.svelte';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';

	import type { PageData } from './$types';

	export let data: PageData;

	let todoData: TodoDisplayData[] = data.todos;

	overrideItemIdKeyNameBeforeInitialisingDndZones('dndId');
</script>

<TodoScreen data={data.todos} />
