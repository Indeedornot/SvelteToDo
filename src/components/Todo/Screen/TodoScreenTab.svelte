<script lang="ts">
	import { Project } from '$components/Icons';
	import { ScreenMore } from '$components/Todo';
	import { slide } from '$lib/helpers/slideAnim';
	import type { TodoDisplayData } from '$lib/models/TodoData';

	export let data: TodoDisplayData;
	export let chosen: boolean;
	export let changeIndex: (id: number) => void;
	export let onDelete: (id: number) => void;
</script>

<div
	class="rounded-t border border-b-0 border-border bg-secondary "
	out:slide={{ axis: 'x', duration: 400 }}
	in:slide={{ axis: 'x', duration: 400, delay: 50, easing: (t) => (t * t) / 2 }}
>
	<div
		class="flex h-full w-full flex-none flex-row px-3 py-1 transition-all duration-300 ease-linear"
		class:bg-accent={chosen}
		class:px-2={chosen}
	>
		<button class="flex flex-none flex-row items-center justify-center" on:click={() => changeIndex(data.sortOrder)}>
			<Project size={20} />
			<div class="pl-1">
				{data.title}
			</div>
		</button>
		{#if chosen}
			<div transition:slide|local={{ axis: 'x' }}>
				<button class="flex h-full w-full flex-none items-center whitespace-nowrap pl-1">
					<ScreenMore onDelete={() => onDelete(data.id)} />
				</button>
			</div>
		{/if}
	</div>
</div>
