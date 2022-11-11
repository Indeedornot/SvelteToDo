<script>
	import TodoDisplay from '$components/Todo/Display/TodoDisplay.svelte';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import { TodoDisplayDataSample } from '$lib/models/SampleData';
</script>

<Meta
	title="Components/Todo/TodoDisplay"
	component={TodoDisplay}
	parameters={{
		layout: 'fullscreen'
	}}
/>

<Template let:args>
	<div class="h-screen w-screen">
		<TodoDisplay {...args} />
	</div>
</Template>

<Story
	name="default"
	args={{
		todos: TodoDisplayDataSample
	}}
/>
