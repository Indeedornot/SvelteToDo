<script lang="ts">
	import type { TabFilterData } from '$lib/models/FilterData/TabFilterData';
	import { statusType, statusTypeDisplay } from '$lib/models/TodoData';

	export let filterData: TabFilterData;
	export let id: number;
</script>

<details class="border-b-2 border-muted">
	<summary
		class=" list-none border-b border-muted pb-1.5 pt-1 
				pl-[12px] pr-[15px] hover:bg-neutral-subtle"
		>Status
	</summary>
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
					bind:checked={filterData.statuses[value]}
					id="filter-item-{id}-{key}"
				/>
				<label for="filter-item-{id}-{key}" class="pl-[4px]">{statusTypeDisplay[value]}</label>
			</div>
		{/each}
	</div>
</details>
