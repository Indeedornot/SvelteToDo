<script lang="ts">
	import TodoDisplay from '../components/Todo/TodoDisplay.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let projectName = 'ReactMailing';

	const postData = async () =>
		await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data.todos)
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
</script>

<div class="flex h-full w-full flex-col bg-primary text-font-secondary">
	<div class="header flex h-[103px] w-full flex-none items-center px-[32px] text-[20px]">
		<h1>{projectName}</h1>
		<button on:click={postData}>postData</button>
	</div>
	<div class="flex min-h-0 flex-grow bg-secondary">
		<TodoDisplay bind:todos={data.todos} />
	</div>
</div>
