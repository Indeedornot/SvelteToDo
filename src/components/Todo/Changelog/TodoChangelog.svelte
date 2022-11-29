<script lang="ts">
	import { capitalizeStart } from '$lib/helpers/jsUtils';
	import type { TodoHistoryAll } from '$lib/stores/Todo';

	type T = $$Generic;
	type W = TodoHistoryAll<T>;

	export let history: W;
	export let keys: (keyof T)[];

	export let title: string;
</script>

<!-- now boxshadow mixes in, otherwise we should be good, change also on hover header's bottom border -->
<div
	class="flex w-full flex-none flex-col overflow-hidden rounded-md border border-muted bg-default hover:border-muted hover:shadow-outline-muted"
>
	<div
		class="flex h-[33px] flex-none items-center rounded-t-md border-b-2 border-muted px-2 font-semibold text-default "
	>
		Todo{title}
		{capitalizeStart(history.type)} - {history.date.toLocaleTimeString()}
	</div>
	<div class="flex w-full flex-grow flex-col ">
		{#each keys as key}
			<div class="group flex w-full flex-row border-b-2 border-muted">
				<div
					class="flex w-[85px] flex-none items-center overflow-hidden border-r border-muted bg-default py-1 pl-2 group-hover:bg-neutral-subtle"
				>
					{key}
				</div>
				<div
					class="flex h-full w-full overflow-hidden text-ellipsis
						break-all bg-subtle 
						group-hover:bg-neutral-muted child:h-full child:justify-center child:py-1 child:px-[1px] child:pl-0.5 child:text-center"
				>
					{#if history.type === 'added'}
						<div class="w-full">{history.new[key]}</div>
					{:else if history.type === 'removed'}
						<div class="w-full">{history.old[key]}</div>
					{:else if history.type === 'changed'}
						{#if history.old[key] === history.new[key]}
							<div class="w-full">{history.old[key]}</div>
						{:else}
							<div class="flex w-1/2">{history.old[key]}</div>
							<div class="flex w-1/2 border-l border-muted">
								{history.new[key]}
							</div>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
