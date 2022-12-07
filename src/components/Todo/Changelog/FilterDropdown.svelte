<script lang="ts">
	import { Filter } from '$components/Icons';
	import { slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button';
	import { type HistoryFilterData, sortType } from '$lib/models/FilterData/HistoryFilterData';

	import DropdownBase from '../DropdownBase.svelte';
	import FilterOptions from './FilterOptions.svelte';
	import SortOptions from './SortOptions.svelte';

	let showTooltip = false;

	export let filterOpts: HistoryFilterData = {
		historyData: {
			item: {
				added: true,
				removed: true,
				changed: true
			},
			tab: {
				added: true,
				removed: true,
				changed: true
			},
			display: {
				added: true,
				removed: true,
				changed: true
			}
		},
		sort: sortType.date
	};
</script>

<DropdownBase
	bind:showTooltip={showTooltip}
	options={{
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [7, 5],
		fallbackPlacements: []
	}}
	zIndex={1}
>
	<button
		slot="button"
		class="flex items-center"
		use:blurClick={showTooltip}
		on:click={() => (showTooltip = !showTooltip)}
	>
		<Filter />
	</button>
	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		class="tooltip styled-scrollbar max-h-[350px]
			overflow-y-auto rounded-md border border-muted bg-subtle
			text-[14px] text-default shadow-ambient child-hover:bg-neutral-subtle"
	>
		<FilterOptions bind:filterOpts={filterOpts} />
		<SortOptions bind:filterOpts={filterOpts} />
	</div>
</DropdownBase>

<style>
	.tooltip > :global(*) {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
