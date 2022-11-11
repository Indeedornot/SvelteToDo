<script lang="ts">
	import { stopTyping } from '$lib/helpers/onStopTyping';
	import { TodoTabConstr } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';
	import '$lib/styles/TextArea.css';
	import FaMinus from 'svelte-icons/fa/FaMinus.svelte';

	export let onDelete: () => void;
	export let onStopTyping: () => void;
	export let title: string;
</script>

<div class="h-[42px] flex-row px-[12px] pt-[8px] pb-[2px] text-[16px] font-bold">
	<div class="flex h-full w-full flex-none flex-row items-center text-font-primary">
		<textarea
			class="stylelessTextArea mr-[3px] flex flex-grow overflow-hidden whitespace-nowrap rounded py-[4px] pl-[4px] transition-colors duration-200 ease-linear
			hover:bg-secondary focus:bg-secondary"
			maxlength={TodoTabConstr.title.maxlength}
			bind:value={title}
			use:stopTyping
			on:stopTyping={onStopTyping}
			rows="1"
		/>

		<div class="flex aspect-square h-full flex-none justify-center p-0.5">
			<button
				class="h-full w-full rounded p-1.5 text-font-secondary shadow outline-none transition-colors duration-150 ease-linear hover:bg-secondary focus:outline-none"
				type="button"
				on:click={onDelete}
			>
				<FaMinus />
			</button>
		</div>
	</div>
</div>
