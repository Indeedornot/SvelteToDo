<script lang="ts">
	import { Delete, More } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { slide } from '$lib/helpers/slideAnim';

	import DropdownBase from '../DropdownBase.svelte';

	export let onDelete: () => void;
	const onDel = () => {
		showTooltip = false;
		onDelete();
	};

	export let canShow: boolean;
	let showTooltip = false;
</script>

<DropdownBase
	canShow={canShow}
	bind:showTooltip={showTooltip}
	options={{
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [0, 3],
		fallbackPlacements: []
	}}
	zIndex={1}
>
	<button
		slot="button"
		use:blurClick={showTooltip}
		on:click={() => (showTooltip = !showTooltip)}
		class="flex flex-none items-center justify-center whitespace-nowrap rounded p-0.5 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
	>
		<More size={16} />
	</button>
	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		class="tooltip text-font-primary
			rounded-md border border-muted bg-subtle text-[14px] text-default 
			shadow-ambient child-hover:bg-neutral-subtle"
	>
		<button class="flex items-center justify-center" on:click={onDel}>
			<Delete size={14} class="inline-block" />
			<span class="pb-[2px] pl-[2px]">Delete</span>
		</button>
	</div>
</DropdownBase>

<!--
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		class="tooltip rounded-md border border-accent bg-secondary text-[12px] text-font-primary child-hover:bg-accent"
	>
		{#each statuses as stat}
			<button on:click={() => setStatus(stat)}>{stat}</button>
		{/each}
		<!--    <div id="arrow" data-popper-arrow /> -- >
	</div>
{/if}
-->
<style>
	.tooltip > * {
		text-align: left;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
