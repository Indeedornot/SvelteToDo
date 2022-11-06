<script lang="ts">
	import { TodoDisplayDataSample } from '$lib/models/SampleData';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { postTodoDisplay } from '$lib/prisma/apiCalls';
	import TodoDisplay from '../components/Todo/TodoDisplay.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let todoData: TodoDisplayData = data.todos;

	let projectName = 'ReactMailing';
</script>

<div class="flex h-full w-full flex-col bg-primary text-font-secondary">
	<div class="header flex h-[103px] w-full flex-none items-center px-[32px] text-[20px]">
		<h1>{projectName}</h1>
	</div>
	<div class="flex min-h-0 flex-grow bg-secondary">
		<TodoDisplay bind:title={todoData.title} id={todoData.id} bind:todoTabs={todoData.todoTabs} />
	</div>
</div>
