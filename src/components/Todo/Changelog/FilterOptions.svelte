<script lang="ts">
	import { capitalizeStart } from '$lib/helpers';
	import type { HistoryFilterData } from '$lib/models/FilterData/HistoryFilterData';

	export let filterOpts: HistoryFilterData;
</script>

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
