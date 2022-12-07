<script lang="ts">
	import { sortType } from '$lib/models/FilterData/TabFilterData';

	export let onSort: (value: sortType) => void;
</script>

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
