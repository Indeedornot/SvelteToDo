<script lang="ts">
	import '$lib/styles/Scrollbar.css';
	import GoPlus from 'svelte-icons/go/GoPlus.svelte';

	export let onAdd: () => void;
</script>

<button
	class="flex h-[42px] flex-none flex-row items-center py-[12px] px-[6px] text-[12px] text-font-secondary transition-colors duration-150 ease-linear hover:bg-secondary"
	on:click={onAdd}
>
	<span class="mr-[8px] h-[16px] w-[16px]">
		<GoPlus />
	</span>
	Add Item
</button>
