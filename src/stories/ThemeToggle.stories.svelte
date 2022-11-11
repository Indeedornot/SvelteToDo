<script>
	import ThemeToggle from '$components/ThemeToggle/ThemeToggle.svelte';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
</script>

<Meta title="Components/ThemeToggle" component={ThemeToggle} />

<Template let:args>
	<ThemeToggle {...args} />
</Template>

<Story name="default" />
