<script lang="ts">
	import { Plus } from '$components/Icons';
	import '$lib/styles/Scrollbar.css';

	export let onAdd: () => void;
</script>

<button
	class="border-box flex h-[42px] flex-none flex-row items-center
	 rounded-b px-[6px] text-[12px] text-subtle hover:bg-neutral-muted"
	on:click={onAdd}
>
	<Plus size={20} class="mr-[8px]" />

	Add Item
</button>
