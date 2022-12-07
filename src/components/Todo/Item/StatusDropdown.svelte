<script lang="ts">
	import { Dropdown } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { slide } from '$lib/helpers/slideAnim';
	import { statusType, statusTypeDisplay } from '$lib/models/TodoData';

	import DropdownBase from '../DropdownBase.svelte';

	export let onChoose: (status: statusType) => void;
	export let status: statusType;

	export let canShow: boolean;
	let showTooltip = false;
	const setStatus = (newStatus: statusType) => {
		showTooltip = false;
		status = newStatus;
		onChoose && onChoose(newStatus);
	};
</script>

<DropdownBase
	canShow={canShow}
	bind:showTooltip={showTooltip}
	options={{
		placement: 'bottom-start',
		strategy: 'absolute',
		offset: [-1, 2],
		fallbackPlacements: []
	}}
>
	<button
		slot="button"
		use:blurClick={showTooltip}
		on:click={() => (showTooltip = !showTooltip)}
		class="flex h-full w-full flex-none items-center whitespace-nowrap 
	rounded px-1 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
	>
		<span class="pr-1">{statusTypeDisplay[status]}</span>
		<Dropdown size={16} />
	</button>
	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		class="tooltip rounded-md border 
			border-muted bg-subtle text-[14px] text-default 
			shadow-ambient child-hover:bg-neutral-subtle"
	>
		{#each Object.entries(statusType) as [_, value]}
			<button on:click={() => setStatus(value)}>{statusTypeDisplay[value]}</button>
		{/each}
	</div>
</DropdownBase>

<style>
	.tooltip > * {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
