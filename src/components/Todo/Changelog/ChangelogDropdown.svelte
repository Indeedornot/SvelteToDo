<script lang="ts">
	import { History } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { createDropdown } from '$lib/helpers/dropdownCtor';
	import { slide } from '$lib/helpers/slideAnim';
	import { TodoHistory, type TodoHistoryData } from '$lib/stores/Todo';

	import TodoChangelog from './TodoChangelog.svelte';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [0, 5],
		fallbackPlacements: []
	});

	const closeTooltip = () => {
		showTooltip = false;
	};
	const toggleTooltip = (event: Event) => {
		showTooltip = !showTooltip;
	};

	let showTooltip = false;

	let history: TodoHistoryData[] = [...$TodoHistory].sort((a, b) => b.date.getTime() - a.date.getTime());
	$: history = [...$TodoHistory].sort((a, b) => b.date.getTime() - a.date.getTime());
</script>

<button
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	use:clickOutside
	on:clickoutside={closeTooltip}
	class="flex h-full w-full flex-none 
			items-center justify-center 
			rounded border border-muted bg-subtle
			p-1.5 text-subtle
			hover:bg-neutral-emphasis hover:text-default 
			focus:bg-neutral-muted focus:text-default"
>
	<History />
</button>

{#if showTooltip}
	<div
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		use:popperContent={extraOpts}
		class="z-[2] h-[50vh] flex-grow overflow-hidden  border border-subtle text-[16px] text-default shadow-ambient sm:w-[100vw] xs:w-[400px] xs:rounded-md"
	>
		<div class="s h-full w-full bg-default">
			<div
				class="flex h-[40px] w-full flex-none items-center border-b-2 border-default pl-2 text-[20px] font-bold text-default"
			>
				<span>Changelog</span>
				<span
					class="mx-1 mt-1 flex w-fit items-center justify-center truncate
			rounded-full bg-neutral-muted py-[2px] px-[4px] text-[16px] font-semibold leading-tight text-default"
					>{history.length}
				</span>
			</div>

			<div
				class="changelogs styled-scrollbar h-full bg-neutral-muted px-1.5 pt-1 child:pt-1.5"
				class:overflow-y-auto={showTooltip}
			>
				{#each history as historyItem}
					{#if historyItem.historyType === 'display'}
						<TodoChangelog title={'Display'} history={historyItem} keys={['title']} />
					{:else if historyItem.historyType === 'tab'}
						<TodoChangelog title={'Tab'} history={historyItem} keys={['title']} />
					{:else}
						<TodoChangelog title={'Item'} history={historyItem} keys={['title', 'status', 'collapsed']} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<!--
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		class="tooltip rounded-md border border-accent bg-secondary text-[12px] text-font-primary child-hover:bg-accent"
	>
		{#each statuses as stat}
			<button on:click={() => setStatus(stat)}>{stat}</button>
		{/each}
		<!--    <div id="arrow" data-popper-arrow /> -- >
	</div>
{/if}
-->
<style>
	.changelogs > :global(*) {
		margin-bottom: 4px;
		margin-top: 4px;
	}
</style>
