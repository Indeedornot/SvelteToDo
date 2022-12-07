<script lang="ts">
	import { Filter } from '$components/Icons';
	import { clickOutside, createDropdown, slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { type TabFilterData, sortType } from '$lib/models/FilterData/TabFilterData';
	import { statusType, statusTypeDisplay } from '$lib/models/TodoData';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [-10, 3],
		fallbackPlacements: []
	});
	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;
	export let onSort: (value: sortType) => void;
	export let showTooltip = false;

	export let filterData: TabFilterData = {
		itemData: {
			statuses: {
				...Object.fromEntries(Object.values(statusType).map((status) => [status, true]))
			}
		}
	};
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
			<details class="border-b-2 border-muted">
				<summary
					class=" list-none border-b border-muted pb-1.5 pt-1 
				pl-[12px] pr-[15px] hover:bg-neutral-subtle">Status</summary
				>
				<div class="w-full">
					{#each Object.entries(statusType) as [key, value]}
						<div
							class="flex items-center pl-[20px] pr-[15px] pb-0.5 
						pt-0.5 last:pb-1 hover:bg-neutral-subtle"
						>
							<input
								class="border-gray-300 checked:border-blue-600 
                                    inline h-4 w-4 
									cursor-pointer appearance-none rounded-sm border 
									bg-white bg-contain bg-center bg-no-repeat 
                                    align-top transition duration-200 checked:bg-blue-600 focus:outline-none"
								type="checkbox"
								bind:checked={filterData.itemData.statuses[value]}
								id="filter-item-{key}"
							/>
							<label for="filter-item-{key}" class="pl-[4px]">{statusTypeDisplay[value]}</label>
						</div>
					{/each}
				</div>
			</details>
			<details class="border-b-2 border-muted">
				<summary class="list-none pb-1 pt-1 pl-[12px] pr-[15px] hover:bg-neutral-subtle">Sort</summary>
				{#each Object.entries(sortType) as [key, value]}
					<button
						class="h-full w-full pb-0.5 pt-0.5 text-left last:pb-1 hover:bg-neutral-subtle"
						on:click={() => onSort(value)}
					>
						<span class="pl-10">{value}</span>
					</button>
				{/each}
			</details>
		</div>
	{/if}
</div>

<!-- 
						<div class="flex items-center pb-0.5 pt-0.5 pl-[20px] pr-[15px] last:pb-1 hover:bg-neutral-subtle">
						<input
							class="border-gray-300 checked:border-blue-600 
								inline h-4 w-4 cursor-pointer appearance-none rounded-sm 
								border bg-white bg-contain bg-center bg-no-repeat 
								align-top transition duration-200 checked:bg-blue-600 focus:outline-none"
							type="radio"
							value={value}
							bind:group={filterData.sort}
							checked={filterData.sort === value}
							name="sort"
							id="filter-item-{key}"
						/>
						<label for="filter-item-{key}" class="pl-2">{value}</label>
					</div>
 -->
