<script lang="ts">
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { TodoTabConstr } from '$lib/models/TodoData';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';
	import FaMinus from 'svelte-icons/fa/FaMinus.svelte';

	export let onDelete: () => void;
	export let onStopTyping: () => void;
	export let title: string;
</script>

<div class="h-[42px] flex-row px-[12px] pt-[8px] pb-[2px] text-[16px] font-bold">
	<div class="flex h-full w-full flex-none flex-row items-center text-font-primary">
		<div
			class="single-line content-editable mr-[3px] flex flex-grow text-ellipsis rounded py-[4px] pl-[4px] transition-colors duration-200 ease-linear
			hover:bg-secondary focus:bg-secondary"
			contenteditable="true"
			bind:innerHTML={title}
			use:stopTyping
			on:stopTyping={onStopTyping}
			use:maxLength={TodoTabConstr.title.maxlength}
			use:truncateEditable
		/>

		<div class="flex aspect-square h-full flex-none justify-center p-0.5">
			<button
				class="h-full w-full rounded p-1.5 text-font-secondary shadow outline-none transition-colors duration-200 ease-linear hover:bg-secondary"
				type="button"
				on:click={onDelete}
			>
				<FaMinus />
			</button>
		</div>
	</div>
</div>
