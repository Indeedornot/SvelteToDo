<script lang="ts">
	import { Filter } from '$components/Icons';
	import DropdownBase from '$components/Todo/DropdownBase.svelte';
	import { slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { type TabFilterData, getDefaultFilterData, type sortType } from '$lib/models/FilterData/TabFilterData';

	import TabFilterOptions from './TabFilterOptions.svelte';
	import TabSort from './TabSort.svelte';

	const toggleTooltip = () => (showTooltip = !showTooltip);
	export let showTooltip = false;

	export let onSort: (value: sortType) => void;

	export let filterData: TabFilterData = getDefaultFilterData();
	export let id: number;
</script>

<DropdownBase
	bind:showTooltip={showTooltip}
	options={{
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [-10, 3],
		fallbackPlacements: []
	}}
>
	<button slot="button" class="dropdown-item flex items-center" use:blurClick={showTooltip} on:click={toggleTooltip}>
		<Filter size={14} />
		<span class="pl-[4px]">Filter</span>
	</button>

	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		class="w-[140px] rounded-md border 
		border-muted bg-subtle text-[16px] text-default shadow-ambient"
	>
		<TabFilterOptions bind:filterData={filterData} id={id} />
		<TabSort onSort={onSort} />
	</div>
</DropdownBase>
