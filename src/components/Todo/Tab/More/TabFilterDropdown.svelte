<script lang="ts">
	import { Filter } from '$components/Icons';
	import { clickOutside, createDropdown, slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { type TabFilterData, type sortType, getDefaultFilterData } from '$lib/models/FilterData/TabFilterData';

	import TabFilterOptions from './TabFilterOptions.svelte';
	import TabSort from './TabSort.svelte';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [-10, 3],
		fallbackPlacements: []
	});
	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;
	export let showTooltip = false;

	export let onSort: (value: sortType) => void;

	export let filterData: TabFilterData = getDefaultFilterData();
	export let id: number;
</script>

<button
	class="dropdown-item flex items-center"
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	bind:this={buttonRef}
>
	<Filter size={14} />
	<span class="pl-[4px]">Filter</span>
</button>
<div>
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y' }}
			out:slide={{ duration: 300, axis: 'y' }}
			use:clickOutside={[buttonRef]}
			on:clickOutside={closeTooltip}
			class="w-[140px] rounded-md border 
		border-muted bg-subtle text-[16px] text-default shadow-ambient"
		>
			<TabFilterOptions bind:filterData={filterData} id={id} />
			<TabSort onSort={onSort} />
		</div>
	{/if}
</div>
