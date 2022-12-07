<script lang="ts">
	import { Filter } from '$components/Icons';
	import { capitalizeStart, clickOutside, createDropdown, slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button';

	import { type HistoryFilterData, sortType } from '../../../lib/models/FilterData/HistoryFilterData';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [7, 5],
		fallbackPlacements: []
	});

	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;

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

	$: console.log('filterData', filterOpts);
</script>

<button
	class="flex items-center"
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	bind:this={buttonRef}
>
	<Filter />
</button>
{#if showTooltip}
	<div
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		use:clickOutside={[buttonRef]}
		on:clickOutside={closeTooltip}
		use:popperContent={extraOpts}
		class="tooltip styled-scrollbar max-h-[350px] overflow-y-auto
			rounded-md border border-muted bg-subtle 
			text-[14px] text-default shadow-ambient child-hover:bg-neutral-subtle"
	>
		{#each Object.entries(filterOpts.historyData) as [type, filters]}
			<div>
				<details class="flex w-[115px] flex-none flex-row">
					<summary>{capitalizeStart(type)}</summary>
					<div class="w-full">
						{#each Object.entries(filters) as [filter]}
							<div class="flex h-full w-full flex-none items-center">
								<div class="flex p-2">
									<input
										class="border-gray-300 checked:border-blue-600 
                                    inline h-4 w-4 cursor-pointer appearance-none rounded-sm 
                                    border bg-white bg-contain bg-center bg-no-repeat 
                                    align-top transition duration-200 checked:bg-blue-600 focus:outline-none"
										type="checkbox"
										bind:checked={filterOpts.historyData[type][filter]}
										id="filter-{type}-{filter}"
									/>
								</div>
								<label class="text-gray-800 flex" for="filter-{type}-{filter}">{capitalizeStart(filter)}</label>
							</div>
						{/each}
					</div>
				</details>
			</div>
		{/each}

		<div>
			<details class="flex w-[115px] flex-none flex-row">
				<summary>Sort</summary>
				{#each Object.entries(sortType) as [sort, value]}
					<div class="flex h-full w-full items-center">
						<div class="flex p-2">
							<input
								class="border-gray-300 checked:border-blue-600 
                        inline h-4 w-4 cursor-pointer appearance-none rounded-sm 
                        border bg-white bg-contain bg-center bg-no-repeat 
                        align-top transition duration-200 checked:bg-blue-600 focus:outline-none"
								type="radio"
								value={value}
								checked={filterOpts.sort === value}
								id="filter-sort-{sort}"
								bind:group={filterOpts.sort}
								name="sort"
							/>
						</div>
						<label class="text-gray-800 flex" for="filter-sort-{sort}">{capitalizeStart(value)}</label>
					</div>
				{/each}
			</details>
		</div>
	</div>
{/if}

<style>
	.tooltip > * {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
