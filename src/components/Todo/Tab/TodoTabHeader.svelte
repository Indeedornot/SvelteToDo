<script lang="ts">
	import { TabMore } from '$components/Todo';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { singleLine } from '$lib/helpers/contentEditable/singleLine';
	import { dndHandle } from '$lib/helpers/dnd/dndHandle';
	import type { TabFilterData, sortType } from '$lib/models/FilterData/TabFilterData';
	import { TodoTabConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	export let onDelete: () => void;
	export let onStopTyping: () => void;
	export let onSort: (value: sortType) => void;
	export let title: string;
	export let isDragged: boolean = false;

	export let itemCount: number;

	export let filterData: TabFilterData;
</script>

<div class="flex h-[42px] touch-none flex-col pb-[2px] text-[16px]" use:dndHandle={true}>
	<div class="flex h-[10px] w-full flex-none items-end justify-center pb-[2px]">
		<div
			class="box-border flex h-full w-4/12 flex-none cursor-grab rounded-b bg-subtle hover:bg-neutral-muted active:bg-neutral-muted"
			class:dragging={isDragged}
			use:dndHandle={isDragged}
			on:dragged={(e) => (isDragged = e.detail.isDragged)}
		/>
	</div>
	<div class="flex max-h-full w-full flex-shrink-0 flex-grow flex-row items-center px-[12px] pb-1 text-default">
		<div
			class="single-line content-editable relative z-[1] mr-[4px] flex truncate rounded pl-[4px] pr-[4px] font-bold
			hover:bg-overlay focus:bg-overlay focus:shadow-outline-muted"
			contenteditable="true"
			use:stopTyping
			on:stopTyping={(event) => {
				title = event.detail.text;
				onStopTyping();
			}}
			use:singleLine
			use:maxLength={{ maxLength: TodoTabConstr.title.maxLength, value: title }}
			use:truncateEditable
		/>

		<span
			class="mx-1 flex w-fit items-center justify-center truncate rounded-full bg-overlay
			py-[2px] px-[4px] text-xs font-semibold leading-tight text-subtle"
			>{itemCount}
		</span>
		<div
			class="ml-auto box-border flex aspect-square h-full flex-none items-center justify-center rounded text-default"
		>
			<TabMore onDelete={onDelete} canShow={!isDragged} bind:filterData={filterData} onSort={onSort} />
		</div>
	</div>
</div>

<style>
	.dragging {
		cursor: grabbing;
	}
</style>
