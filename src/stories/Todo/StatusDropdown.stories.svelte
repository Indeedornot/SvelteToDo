<script>
	import StatusDropdown from '$components/Todo/Item/StatusDropdown.svelte';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

	let status = 'todo';
</script>

<Meta title="Components/Todo/StatusDropdown" component={StatusDropdown} />

<Template let:args>
	<div class="h-[66px] w-full rounded-lg bg-secondary pt-[8px] pb-[12px]">
		<div class="flex h-[24px] items-center px-[12px] text-[12px] text-font-secondary">
			{status}
			<StatusDropdown bind:status={status} {...args} />
		</div>
		<div class="flex items-center px-[12px] text-[14px] text-font-primary">
			<span class="truncate" contenteditable="true">"Test StatusDropdown"</span>
		</div>
	</div>
</Template>

<Story name="default" />
