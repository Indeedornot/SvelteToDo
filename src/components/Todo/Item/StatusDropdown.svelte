<script lang="ts">
	import { Dropdown } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { clickOutside } from '$lib/helpers/clickOutside.js';
	import { createDropdown } from '$lib/helpers/dropdownCtor';
	import { slide } from '$lib/helpers/slideAnim';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-start',
		strategy: 'absolute',
		offset: [-1, 2],
		fallbackPlacements: []
	});

	const closeTooltip = () => {
		showTooltip = false;
	};
	const toggleTooltip = (event: Event) => {
		showTooltip = !showTooltip;
	};

	export let onChoose: (status: string) => void;
	export let status = '';

	let showTooltip = false;
	let statuses = ['Draft', 'Completed', 'In Progress', 'Archived', 'Abandoned'];
	const setStatus = (newStatus: string) => {
		closeTooltip();
		status = newStatus;
		onChoose && onChoose(newStatus);
	};
</script>

<button
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	use:clickOutside
	on:clickoutside={closeTooltip}
	class="flex h-full w-full flex-none items-center whitespace-nowrap 
	rounded px-1 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
>
	<span class="pr-1">{status}</span>
	<Dropdown size={16} />
</button>
<div class="relative">
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y' }}
			out:slide={{ duration: 300, axis: 'y' }}
			class="tooltip rounded-md border border-muted 
			bg-subtle text-[14px] text-default shadow-ambient 
			child-hover:bg-neutral-subtle"
		>
			{#each statuses as stat}
				<button on:click={() => setStatus(stat)}>{stat}</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tooltip > * {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
