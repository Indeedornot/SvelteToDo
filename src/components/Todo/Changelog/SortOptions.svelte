<script lang="ts">
	import { capitalizeStart } from '$lib/helpers';
	import { type HistoryFilterData, sortType } from '$lib/models/FilterData/HistoryFilterData';

	export let filterOpts: HistoryFilterData;
</script>

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
