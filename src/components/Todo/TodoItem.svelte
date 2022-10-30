<script lang="ts">
	import StatusDropdown from './StatusDropdown.svelte';
	import '$lib/styles/TextArea.css';
	import { TodoItemConstr } from '$lib/models/TodoData';

	export let id: number;
	export let status: string;
	export let title: string;
</script>

<div class="h-[66px] w-full rounded-lg bg-secondary pt-[8px] pb-[12px]">
	<div class="flex h-[24px] items-center px-[12px] text-[12px] text-font-secondary">
		{status}
		<StatusDropdown bind:status />
	</div>
	<div class="flex items-center px-[12px] text-[14px] text-font-primary">
		<textarea
			class="stylelessTextArea overflow-hidden whitespace-nowrap"
			maxlength={TodoItemConstr.title}
			bind:value={title}
		/>
	</div>
</div>
