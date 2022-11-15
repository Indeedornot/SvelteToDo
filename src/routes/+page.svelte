<script lang="ts">
	import TodoDisplay from '$components/Todo/Display/TodoDisplay.svelte';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';

	import type { PageData } from './$types';

	export let data: PageData;

	let todoData: TodoDisplayData = data.todos;

	overrideItemIdKeyNameBeforeInitialisingDndZones('dndId');
</script>

<div class="flex h-full w-full flex-col bg-primary text-font-secondary">
	<div class="flex min-h-0 flex-grow bg-secondary">
		<TodoDisplay bind:data={todoData} />
	</div>
</div>
