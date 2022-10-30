<script>
	import TodoDisplay from '../components/Todo/TodoDisplay.svelte';
	import { TodoDisplayDataSample } from '$lib/models/SampleData';

	let projectName = 'ReactMailing';
</script>

<div class="flex h-full w-full flex-col bg-primary text-font-secondary">
	<div class="header flex h-[103px] w-full flex-none items-center px-[32px] text-[20px]">
		<h1>{projectName}</h1>
	</div>
	<div class="flex min-h-0 flex-grow bg-secondary">
		<TodoDisplay todos={TodoDisplayDataSample} />
	</div>
</div>
