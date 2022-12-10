<script lang="ts">
	import { History } from '$components/Icons';
	import { slide } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button';
	import { type HistoryFilterData, sortType } from '$lib/models/FilterData/HistoryFilterData';
	import { TodoHistory, type TodoHistoryData } from '$lib/stores/Todo/TodoHistory';
	import { flip } from 'svelte/animate';

	import DropdownBase from '../DropdownBase.svelte';
	import FilterDropdown from './FilterDropdown.svelte';
	import TodoChangelog from './TodoChangelog.svelte';

	const toggleTooltip = () => (showTooltip = !showTooltip);
	let showTooltip = false;
	let filterOpts: HistoryFilterData;

	const filterHistory = (historyData: TodoHistoryData[]) => {
		if (!filterOpts) return historyData;
		const historyCopy = [...historyData];
		const filtered = historyCopy.filter((item) => !item.hidden && filterOpts.historyData[item.historyType][item.type]);
		visibleItemsCount = filtered.length;
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

	let history: TodoHistoryData[] = $TodoHistory;
	$: history = $TodoHistory;
	let visibleItemsCount = history.length;

	let historyFiltered: TodoHistoryData[] = filterHistory(history);
	$: filterOpts, (historyFiltered = filterHistory(history));

	const delHistoryItem = (id: number) => {
		console.log('delHistoryItem', id);
		TodoHistory.update((history) => {
			const item = history.find((item) => item.id === id);
			if (item) {
				item.hidden = true;
			}
			return history;
		});
	};
</script>

<DropdownBase
	bind:showTooltip={showTooltip}
	options={{
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [0, 5],
		fallbackPlacements: []
	}}
	zIndex={2}
>
	<button
		slot="button"
		use:blurClick={showTooltip}
		on:click={toggleTooltip}
		class="flex h-full w-full flex-none 
			items-center justify-center 
			rounded border border-muted bg-subtle
			p-1.5 text-subtle
			hover:bg-neutral-emphasis hover:text-default 
			focus:bg-neutral-muted focus:text-default"
	>
		<History />
	</button>
	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		class="flex h-[50vh] overflow-hidden border border-subtle text-[16px] text-default shadow-ambient sm:w-[100vw] xs:w-[400px] xs:rounded-md"
	>
		<div class="flex h-full w-full flex-col bg-default">
			<div
				class="flex h-[40px] w-full flex-none items-center justify-between border-b-2 border-default pl-2 text-[20px] font-bold text-default"
			>
				<div class="flex flex-row">
					<span>Changelog</span>
					<span
						class="mx-1 mt-1 flex w-fit items-center justify-center truncate
							rounded-full bg-neutral-muted py-[2px] px-[4px] text-[16px] 
							font-semibold leading-tight text-default"
						>{visibleItemsCount}
					</span>
				</div>
				<div class="mr-2.5">
					<FilterDropdown bind:filterOpts={filterOpts} />
				</div>
			</div>

			<div
				class="styled-scrollbar changelogs flex w-full flex-grow flex-col overflow-y-auto bg-neutral-muted px-1.5 pt-1 child:pt-1.5"
			>
				{#each historyFiltered.filter((item) => !item.hidden) as historyItem (historyItem.id)}
					<div animate:flip={{ duration: 300 }}>
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
					</div>
				{/each}
			</div>
		</div>
	</div>
</DropdownBase>

<style>
	.changelogs > :global(*) {
		margin-bottom: 4px;
		margin-top: 4px;
	}
</style>
