<script lang="ts">
	import { Delete, History, More } from '$components/Icons';
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { slide } from '$lib/helpers/slideAnim';
	import { TodoHistory, type TodoHistoryData } from '$lib/stores/Todo';
	import { createPopperActions } from 'svelte-popperjs';

	import TodoChangelog from './TodoChangelog.svelte';

	//#region Popper
	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom-end',
		strategy: 'absolute'
	});
	const extraOpts = {
		modifiers: [
			{
				name: 'offset',
				options: { offset: [0, 5] }
			},
			{
				name: 'flip',
				options: { fallbackPlacements: [] }
			}
		]
	};

	const closeTooltip = () => {
		showTooltip = false;
	};
	const openTooltip = () => {
		showTooltip = true;
	};
	const toggleTooltip = () => {
		showTooltip = !showTooltip;
	};
	//#endregion

	let showTooltip = true;

	let history: TodoHistoryData[] = [...$TodoHistory].sort((a, b) => b.date.getTime() - a.date.getTime());
	$: history = [...$TodoHistory].sort((a, b) => b.date.getTime() - a.date.getTime());
</script>

<button
	use:popperRef
	on:click={toggleTooltip}
	use:clickOutside
	on:clickoutside={closeTooltip}
	class="flex flex-none items-center whitespace-nowrap"
>
	<History size={24} />
</button>

{#if showTooltip}
	<div
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		use:popperContent={extraOpts}
		class="z-[1] h-[50vh] flex-grow overflow-hidden rounded-md border border-border bg-secondary text-[14px] text-font-primary sm:w-[100vw] xs:w-[350px]"
	>
		<div class="styled-scrollbar h-full w-full overflow-y-auto rounded-t-md">
			<div
				class="flex h-[40px] w-full flex-none items-center border-b-4 border-border bg-accent pl-2 text-[16px] font-bold text-font-primary"
			>
				<span>Changelog</span>
				<span
					class="mx-1 flex w-fit items-center justify-center truncate rounded-full
			bg-secondary py-[2px] px-[4px] text-xs font-semibold leading-tight text-font-secondary"
					>{history.length}
				</span>
			</div>

			<div class="changelogs px-0.5">
				{#each history as historyItem}
					{#if historyItem.historyType === 'display'}
						<TodoChangelog title={'Display'} history={historyItem} keys={['title']} />
					{:else if historyItem.historyType === 'tab'}
						<TodoChangelog title={'Tab'} history={historyItem} keys={['title']} />
					{:else}
						<TodoChangelog title={'Item'} history={historyItem} keys={['title', 'status']} />
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
