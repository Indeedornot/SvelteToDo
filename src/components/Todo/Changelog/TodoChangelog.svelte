<script lang="ts">
	import { capitalizeStart } from '$lib/helpers/jsUtils';
	import type { TodoHistoryAll } from '$lib/stores';

	type T = $$Generic;
	type W = TodoHistoryAll<T>;

	export let history: W;
	export let keys: (keyof T)[];

	export let title: string;
</script>

<div
	class="flex w-full flex-none flex-col rounded-md border border-primary border-opacity-50 hover:bg-accent hover:bg-opacity-75"
>
	<div class="flex h-[33px] flex-none items-center rounded-t-md border-b-2 border-border bg-accent px-2">
		Todo{title}
		{capitalizeStart(history.type)} - {history.date.toLocaleString()}
	</div>
	<div class="flex w-full flex-grow flex-col">
		{#each keys as key}
			<div class="changes flex w-full flex-row hover:bg-primary">
				<div class="flex w-[75px] flex-none items-center border-r border-border bg-accent bg-opacity-75 py-1 pl-3">
					{key}
				</div>
				<div
					class=" flex h-full flex-grow pr-2 
						child:h-full child:justify-center child:py-1 child:pl-0.5 child:text-center"
				>
					{#if history.type === 'added'}
						<div class="flex flex-grow">{history.new[key]}</div>
					{:else if history.type === 'removed'}
						<div class="flex flex-grow">{history.old[key]}</div>
					{:else if history.type === 'changed'}
						{#if history.old[key] === history.new[key]}
							<div class="flex flex-grow">{history.old[key]}</div>
						{:else}
							<div class="flex w-1/2">{history.old[key]}</div>
							<div class="flex w-1/2 border-l border-border">
								{history.new[key]}
							</div>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.changes:not(:last-child) {
		border-bottom: 1px solid rgb(var(--color-border));
	}
</style>
