<script lang="ts">
	import { Delete, More } from '$components/Icons';
	import { clickOutside, createDropdown, slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import type { TabFilterData, sortType } from '$lib/models/FilterData/TabFilterData';
	import { statusType } from '$lib/models/TodoData';

	import FilterOption from './FilterOption.svelte';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [0, 3],
		fallbackPlacements: []
	});
	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;
	let showTooltip = false;
	export let canShow: boolean;
	$: if (!canShow) showTooltip = false;

	export let onDelete: () => void;
	const onDel = () => {
		closeTooltip();
		onDelete();
	};

	export let filterData: TabFilterData;
	export let onSort: (value: sortType) => void;
</script>

<button
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	bind:this={buttonRef}
	class="flex h-fit w-fit flex-none items-center 
	justify-center whitespace-nowrap rounded p-1 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
>
	<More size={16} />
</button>
<div class="relative">
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y' }}
			use:clickOutside={[buttonRef]}
			on:clickOutside={closeTooltip}
			class="tooltip z-[1] rounded-md border
			border-muted bg-subtle text-[16px] text-default shadow-ambient child-hover:bg-neutral-subtle"
		>
			<button class="dropdown-item flex items-center justify-center" on:click={onDel}>
				<Delete size={14} />
				<span class="pl-[4px]">Delete</span>
			</button>
			<FilterOption bind:filterData={filterData} onSort={onSort} />
		</div>
	{/if}
</div>

<style>
	.tooltip > :global(.dropdown-item) {
		text-align: left;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
