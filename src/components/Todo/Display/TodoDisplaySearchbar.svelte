<script lang="ts">
	import { stopTyping } from '$lib/helpers/onStopTyping';
	import '$lib/styles/Scrollbar.css';
	import '$lib/styles/TextArea.css';
	import GoPlus from 'svelte-icons/go/GoPlus.svelte';
	import MdFilterList from 'svelte-icons/md/MdFilterList.svelte';

	export let searchQuery: string;
	export let onSearch: () => void;
	export let onAdd: () => void;
</script>

<div class="flex h-[40px] w-full flex-shrink-0 flex-row items-center border-y-2 border-accent text-font-secondary overflow-y-hidden sm:px-[16px] md:px-[24px] lg:px-[32px]">
	<div class="mr-[8px] h-[24px] w-[24px]">
		<MdFilterList />
	</div>
	<div class="mr-[5px] flex h-full flex-grow items-center focus-within:bg-accent hover:bg-accent">
		<textarea
			class="stylelessTextArea w-full bg-transparent px-[8px] focus:outline-none"
			type="text"
			placeholder="Filter by keyword or by field"
			bind:value={searchQuery}
			use:stopTyping
			on:stopTyping={onSearch}
			rows="1"
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
