<script lang="ts">
	import { Filter, Plus } from '$components/Icons';
	import { maxLength, truncateEditable } from '$lib/helpers/contentEditable';
	import { TodoTabConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	export let searchQuery: string = '';
	export let onAdd: () => void;
</script>

<div
	class="flex h-[40px] w-full flex-shrink-0 flex-row items-center overflow-y-hidden border-y border-border text-font-secondary sm:px-[16px] md:px-[24px] lg:px-[32px]"
>
	<div class="mr-[8px] h-[24px] w-[24px]">
		<Filter />
	</div>
	<div
		class="durtation-200 mr-[5px] flex h-full flex-grow items-center transition-colors ease-linear focus-within:bg-accent hover:bg-accent"
	>
		<div
			class="single-line content-editable w-full text-ellipsis bg-transparent px-[8px]"
			placeholder="Filter by keyword or by field"
			contenteditable="true"
			bind:textContent={searchQuery}
			use:maxLength={{ maxLength: TodoTabConstr.title.maxLength }}
			use:truncateEditable
		/>
	</div>

	<div class="flex aspect-square h-full flex-none items-center justify-center p-1">
		<button
			class="flex h-full w-full flex-none items-center justify-center 
			rounded border border-border text-center text-font-secondary 
			outline-none transition-colors duration-150 ease-linear hover:bg-primary focus:outline-none"
			type="button"
			on:click={onAdd}
		>
			<Plus />
		</button>
	</div>
</div>
