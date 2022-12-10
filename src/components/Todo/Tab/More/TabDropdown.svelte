<script lang="ts">
	import { More } from '$components/Icons';
	import DropdownBase from '$components/Todo/DropdownBase.svelte';
	import { slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import type { TabFilterData, sortType } from '$lib/models/FilterData/TabFilterData';

	import TabDelete from './TabDelete.svelte';
	import FilterOption from './TabFilterDropdown.svelte';

	let showTooltip = false;
	export let canShow: boolean;

	export let onDelete: () => void;
	const onDel = () => {
		showTooltip = false;
		onDelete();
	};

	export let id: string;
	export let filterData: TabFilterData;
	export let onSort: (value: sortType) => void;
</script>

<DropdownBase
	bind:showTooltip={showTooltip}
	canShow={canShow}
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
		class="flex h-fit w-fit flex-none items-center 
	justify-center whitespace-nowrap rounded p-1 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
	>
		<More size={16} />
	</button>
	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		class="tooltip rounded-md border
			border-muted bg-subtle text-[16px] text-default shadow-ambient [&_.dropdown-item:hover]:bg-neutral-subtle"
	>
		<TabDelete onDelete={onDel} />
		<FilterOption bind:filterData={filterData} onSort={onSort} id={id} />
	</div>
</DropdownBase>

<style>
	.tooltip :global(.dropdown-item) {
		text-align: left;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
