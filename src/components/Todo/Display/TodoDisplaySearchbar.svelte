<script lang="ts">
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { TodoTabConstr } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';
	import '$lib/styles/ContentEditable.css';
	import GoPlus from 'svelte-icons/go/GoPlus.svelte';
	import MdFilterList from 'svelte-icons/md/MdFilterList.svelte';

	export let searchQuery: string;
	export let onSearch: () => void;
	export let onAdd: () => void;
</script>

<div
	class="flex h-[40px] w-full flex-shrink-0 flex-row items-center overflow-y-hidden border-y-2 border-accent text-font-secondary sm:px-[16px] md:px-[24px] lg:px-[32px]"
>
	<div class="mr-[8px] h-[24px] w-[24px]">
		<MdFilterList />
	</div>
	<div
		class="durtation-200 mr-[5px] flex h-full flex-grow items-center transition-colors ease-linear focus-within:bg-accent hover:bg-accent"
	>
		<div
			class="single-line content-editable w-full text-ellipsis bg-transparent px-[8px]"
			placeholder="Filter by keyword or by field"
			contenteditable="true"
			bind:innerHTML={searchQuery}
			use:stopTyping
			on:stopTyping={onSearch}
			use:maxLength={TodoTabConstr.title.maxlength}
			use:truncateEditable
		/>
	</div>

	<div class="flex aspect-square h-full flex-none justify-center py-1 px-1">
		<button
			class="h-full w-full rounded bg-secondary text-font-secondary outline-none transition-colors duration-150 ease-linear hover:bg-primary focus:outline-none"
			type="button"
			on:click={onAdd}
		>
			<GoPlus />
		</button>
	</div>
</div>
