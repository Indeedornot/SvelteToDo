<script>
	import TodoItem from '../../components/Todo/TodoItem.svelte';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import { TodoItemDataSample } from '$lib/models/SampleData';
</script>

<Meta title="Components/Todo/TodoItem" component={TodoItem} />

<Template let:args>
	<TodoItem {...args} />
</Template>

<Story
	name="default"
	args={{
		title: TodoItemDataSample.title,
		status: TodoItemDataSample.status,
		id: TodoItemDataSample.id
	}}
/>
