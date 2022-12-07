<script lang="ts">
	import { Filter, History } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { createDropdown } from '$lib/helpers/dropdownCtor';
	import { slide } from '$lib/helpers/slideAnim';
	import { type HistoryFilterData, sortType } from '$lib/models/FilterData/HistoryFilterData';
	import { TodoHistory, type TodoHistoryData } from '$lib/stores/Todo/TodoHistory';

	import FilterDropdown from './FilterDropdown.svelte';
	import TodoChangelog from './TodoChangelog.svelte';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [0, 5],
		fallbackPlacements: []
	});

	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;

	let showTooltip = false;
	let filterOpts: HistoryFilterData;

	let history: TodoHistoryData[] = $TodoHistory;
	$: history = $TodoHistory;

	const filterHistory = () => {
		if (!filterOpts) return history;
		const historyCopy = [...history];
		const filtered = historyCopy.filter((item) => filterOpts.historyData[item.historyType][item.type]);
		switch (filterOpts.sort) {
			case sortType.type:
				return filtered.sort((a, b) => a.type.localeCompare(b.type));
			case sortType.historyType:
				return filtered.sort((a, b) => a.historyType.localeCompare(b.historyType));
			case sortType.date:
			default:
				return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
		}
	};

	let historyFiltered: TodoHistoryData[] = filterHistory();
	$: filterOpts, history, (historyFiltered = filterHistory());

	const delHistoryItem = (id: number) => {
		console.log('delHistoryItem', id);
		TodoHistory.update((history) => {
			const item = history.find((item) => item.id === id);
			if (item) item.hidden = true;
			return history;
		});
	};
</script>

<button
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	bind:this={buttonRef}
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
		use:clickOutside={[buttonRef]}
		on:clickOutside={closeTooltip}
		use:popperContent={extraOpts}
		class="z-[2] h-[50vh] flex-grow overflow-hidden border border-subtle text-[16px] text-default shadow-ambient sm:w-[100vw] xs:w-[400px] xs:rounded-md"
	>
		<div class="flex h-full w-full flex-none flex-col bg-default">
			<div
				class="flex h-[40px] w-full flex-none items-center justify-between border-b-2 border-default pl-2 text-[20px] font-bold text-default"
			>
				<div class="flex flex-row">
					<span>Changelog</span>
					<span
						class="mx-1 mt-1 flex w-fit items-center justify-center truncate
							rounded-full bg-neutral-muted py-[2px] px-[4px] text-[16px] 
							font-semibold leading-tight text-default"
						>{history.length}
					</span>
				</div>
				<div class="mr-2.5">
					<FilterDropdown bind:filterOpts={filterOpts} />
				</div>
			</div>

			<div class="flex w-full flex-shrink-0 flex-grow">
				<div
					class="styled-scrollbar scroll changelogs h-full w-full overflow-y-auto bg-neutral-muted px-1.5 pt-1 child:pt-1.5"
				>
					{#each historyFiltered as historyItem}
						{#if !historyItem.hidden}
							{#if historyItem.historyType === 'display'}
								<TodoChangelog title={'Display'} history={historyItem} keys={['title']} onDelete={delHistoryItem} />
							{:else if historyItem.historyType === 'tab'}
								<TodoChangelog title={'Tab'} history={historyItem} keys={['title']} onDelete={delHistoryItem} />
							{:else}
								<TodoChangelog
									title={'Item'}
									history={historyItem}
									keys={['title', 'status', 'collapsed']}
									onDelete={delHistoryItem}
								/>
							{/if}
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.changelogs > :global(*) {
		margin-bottom: 4px;
		margin-top: 4px;
	}
</style>
