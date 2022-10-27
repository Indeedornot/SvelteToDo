<script>
  import TodoTab from "../components/Todo/TodoTab.svelte";
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
</script>

<Meta title="Components/Todo/TodoTab" component={TodoTab} />

<Template let:args>
  <TodoTab {...args} />
</Template>

<Story name="default" />
