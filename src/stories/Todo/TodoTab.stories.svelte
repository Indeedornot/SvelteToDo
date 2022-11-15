<script>
	import TodoTab from '$components/Todo/Tab/TodoTab.svelte';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import { TodoTabSample } from '$lib/models/SampleData';
</script>

<Meta title="Components/Todo/TodoTab" component={TodoTab} />

<Template let:args>
	<TodoTab {...args} />
</Template>

<Story
	name="default"
	args={{
		id: TodoTabSample.id,
		title: TodoTabSample.title,
		todoItems: TodoTabSample.todoItems
	}}
/>
