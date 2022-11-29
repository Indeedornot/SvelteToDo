<script lang="ts">
	import { Filter, Plus } from '$components/Icons';
	import { maxLength, truncateEditable } from '$lib/helpers/contentEditable';
	import { singleLine } from '$lib/helpers/contentEditable/singleLine';
	import { TodoTabConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	export let searchQuery: string = '';
	export let onAdd: () => void;

	let searchInput: HTMLElement;
</script>

<div
	class="z-[1] flex h-[40px] w-full flex-shrink-0 flex-row items-center 
	overflow-y-hidden border-y border-muted 
	text-subtle
	focus-within:shadow-outline-default sm:pl-[16px] sm:pr-[24px] md:pl-[24px] md:pr-[32px]"
>
	<div class="relative mr-[8px] flex h-full w-[24px] flex-none items-center">
		<button
			class="hover:bg-border box-border flex w-full flex-none items-center justify-center rounded-full py-1.5 hover:text-default"
			on:click={() => searchInput.focus()}
		>
			<Filter size={20} />
		</button>
	</div>
	<div class="durtation-200 mr-[5px] flex h-full flex-grow items-center transition-colors ease-linear">
		<div
			class="single-line content-editable bg-transparent w-full text-ellipsis px-[8px]"
			placeholder="Filter by keyword or by field"
			contenteditable="true"
			bind:this={searchInput}
			bind:textContent={searchQuery}
			use:maxLength={{ maxLength: TodoTabConstr.title.maxLength }}
			use:truncateEditable
			use:singleLine
		/>
	</div>

	<div class="flex aspect-square h-full flex-none items-center justify-center p-1">
		<button
			class="flex h-full w-full flex-none items-center justify-center 
			rounded border border-muted
			hover:bg-neutral-muted hover:text-default focus:outline-none"
			type="button"
			on:click={onAdd}
		>
			<Plus />
		</button>
	</div>
</div>
