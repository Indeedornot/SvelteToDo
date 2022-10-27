<script>
  import TodoItem from "../components/Todo/TodoItem.svelte";
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
</script>

<Meta title="Components/Todo/TodoItem" component={TodoItem} />

<Template let:args>
  <TodoItem {...args} />
</Template>

<Story name="default" />
